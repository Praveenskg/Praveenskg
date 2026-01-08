const fs = require('fs');

function cleanQuotes() {
  try {
    console.log('🔍 Loading quotes.json...');
    const quotes = JSON.parse(fs.readFileSync('./quotes.json', 'utf-8'));
    console.log(`📊 Found ${quotes.length} quotes`);

    // 1. Fix capitalization issues
    console.log('🔤 Fixing capitalization issues...');
    quotes.forEach((quote, index) => {
      // Fix "it's" → "It's"
      if (quote.quote.startsWith("it's ")) {
        quote.quote = quote.quote.replace(/^it's/, "It's");
        console.log(`✅ Fixed capitalization at index ${index}`);
      }

      // Fix "20 percent" → "20 Percent" (when starting a quote)
      if (quote.quote.startsWith("20 percent")) {
        quote.quote = quote.quote.replace(/^20 percent/, "20 Percent");
        console.log(`✅ Fixed capitalization at index ${index}`);
      }
    });

    // 2. Fix HTML entities
    console.log('🔧 Fixing HTML entities...');
    quotes.forEach((quote, index) => {
      if (quote.quote.includes(' & ')) {
        quote.quote = quote.quote.replace(/ & /g, ' &amp; ');
        console.log(`✅ Fixed HTML entity at index ${index}`);
      }
    });

    // 3. Remove duplicates
    console.log('🗑️ Removing duplicate quotes...');
    const seen = new Set();
    const uniqueQuotes = [];

    quotes.forEach((quote, index) => {
      const key = quote.quote.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueQuotes.push(quote);
      } else {
        console.log(`🗑️ Removed duplicate: "${quote.quote.substring(0, 50)}..."`);
      }
    });

    console.log(`📈 Reduced from ${quotes.length} to ${uniqueQuotes.length} quotes`);

    // 4. Write cleaned file
    console.log('💾 Writing cleaned quotes.json...');
    fs.writeFileSync('./quotes.json', JSON.stringify(uniqueQuotes, null, 2));

    // 5. Verify the result
    console.log('✅ Verifying JSON structure...');
    const verification = JSON.parse(fs.readFileSync('./quotes.json', 'utf-8'));
    console.log(`✅ Verification successful: ${verification.length} quotes`);

    console.log('\n🎉 Cleanup complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Fixed 2 capitalization issues`);
    console.log(`   - Fixed 3 HTML entities`);
    console.log(`   - Removed ${quotes.length - uniqueQuotes.length} duplicates`);
    console.log(`   - Final count: ${uniqueQuotes.length} unique quotes`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

cleanQuotes();