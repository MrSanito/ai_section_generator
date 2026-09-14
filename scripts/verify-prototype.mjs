async function runVerification() {
  console.log('=== STARTING AUTOMATED TEST SUITE ===');

  // Test 1: POST /api/generate with Pricing prompt
  console.log('\n[TEST 1] POST /api/generate with "A pricing section with 3 tiers"...');
  const pricingRes = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'A pricing section with 3 tiers' }),
  });
  const pricingJson = await pricingRes.json();

  if (!pricingJson.success || pricingJson.layoutType !== 'pricing') {
    throw new Error(`Pricing generation failed: ${JSON.stringify(pricingJson)}`);
  }
  console.log('✓ Success! Layout Type:', pricingJson.layoutType);
  console.log('✓ Matched Keyword:', pricingJson.matchedKeyword);
  console.log('✓ Root Node Type:', pricingJson.data.type, '| ID:', pricingJson.data.id);

  // Verify structure is nested JSON, not raw HTML
  if (typeof pricingJson.data !== 'object' || !pricingJson.data.children) {
    throw new Error('Data is not a nested JSON tree!');
  }
  console.log('✓ Verified: Data is a structured nested JSON tree (Zero raw HTML)');

  // Test 2: POST /api/generate with Hero prompt
  console.log('\n[TEST 2] POST /api/generate with "Modern hero section"...');
  const heroRes = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Modern hero section with CTAs' }),
  });
  const heroJson = await heroRes.json();
  if (!heroJson.success || heroJson.layoutType !== 'hero') {
    throw new Error(`Hero generation failed: ${JSON.stringify(heroJson)}`);
  }
  console.log('✓ Success! Hero Layout Type:', heroJson.layoutType);
  console.log('✓ Matched Keyword:', heroJson.matchedKeyword);

  // Test 3: POST /api/generate with Features prompt
  console.log('\n[TEST 3] POST /api/generate with "Features grid with cards"...');
  const featRes = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Features grid with cards' }),
  });
  const featJson = await featRes.json();
  if (!featJson.success || featJson.layoutType !== 'features') {
    throw new Error(`Features generation failed: ${JSON.stringify(featJson)}`);
  }
  console.log('✓ Success! Features Layout Type:', featJson.layoutType);

  // Test 4: Edit a node's text inline and save
  console.log('\n[TEST 4] Simulating Inline Editing and saving via POST /api/save...');
  const treeToEdit = pricingJson.data;

  // Let's modify a node's content directly
  function updateTextRecursive(node, targetSubstring, newText) {
    if (node.content && node.content.includes(targetSubstring)) {
      console.log(`Found node to edit: "${node.content}" -> "${newText}"`);
      node.content = newText;
      return true;
    }
    if (node.children) {
      for (const child of node.children) {
        if (updateTextRecursive(child, targetSubstring, newText)) return true;
      }
    }
    return false;
  }

  const updated = updateTextRecursive(treeToEdit, 'Starter', 'Super Starter Plan ($15)');
  if (!updated) {
    throw new Error('Failed to find node to update in tree!');
  }

  const saveRes = await fetch('http://localhost:3000/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ layout: treeToEdit, prompt: 'A pricing section with 3 tiers' }),
  });
  const saveJson = await saveRes.json();
  if (!saveJson.success) {
    throw new Error(`Save failed: ${JSON.stringify(saveJson)}`);
  }
  console.log('✓ Save response:', saveJson.message);
  console.log('✓ Saved Node count:', saveJson.nodeCount);

  // Test 5: Verify GET /api/saved returns the edited node
  console.log('\n[TEST 5] Verifying mock DB persistence via GET /api/saved...');
  const savedRes = await fetch('http://localhost:3000/api/saved');
  const savedJson = await savedRes.json();
  if (!savedJson.success || !savedJson.data) {
    throw new Error(`Failed to fetch saved layout: ${JSON.stringify(savedJson)}`);
  }

  let foundEditedText = false;
  function findText(node, text) {
    if (node.content && node.content.includes(text)) {
      foundEditedText = true;
      return;
    }
    if (node.children) {
      for (const child of node.children) findText(child, text);
    }
  }
  findText(savedJson.data, 'Super Starter Plan ($15)');

  if (!foundEditedText) {
    throw new Error('Edited text was not found in saved database record!');
  }
  console.log('✓ Success: Retrieved saved tree from mock DB with edited text verified!');
  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

runVerification().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
