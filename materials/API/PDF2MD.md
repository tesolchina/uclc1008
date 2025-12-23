# PDF to Markdown Converter

This tool converts PDFs in the materials folder to well-formatted Markdown files using the HKBU Gen AI API.

## Process Flow

1. **Input**: PDFs in `/Users/simonwang/Documents/Usage/UE1/materials`
2. **Process**: 
   - Extract text from PDFs and convert to basic markdown
   - Send markdown pages one at a time to LLMs via HKBU Gen AI API
   - Format each page properly while preserving all content
3. **Output**: Formatted markdown files saved to `/Users/simonwang/Documents/Usage/UE1/materials/MD`
4. **Logging**: Real-time updates in `/Users/simonwang/Documents/Usage/UE1/materials/API/process.log`

## Usage

### Prerequisites

Install required Python packages:

```bash
pip install pypdf requests
# OR
pip install -r requirements.txt
```

### Run the Converter

```bash
cd /Users/simonwang/Documents/Usage/UE1/materials/API
python3 pdf_to_md.py
```

Or make it executable and run directly:

```bash
chmod +x pdf_to_md.py
./pdf_to_md.py
```

## Features

- ✅ Automatically finds all PDFs in materials folder (recursive)
- ✅ Extracts text page by page
- ✅ Sends each page to HKBU Gen AI API for formatting
- ✅ Preserves all content (no summarization or omission)
- ✅ Formats markdown properly (headings, lists, tables)
- ✅ Real-time logging to `process.log`
- ✅ Consolidates pages into single markdown file
- ✅ Maintains original filenames (with .md extension)

## Configuration

The script uses:
- **API**: HKBU Gen AI Platform (`https://genai.hkbu.edu.hk/api/v0/rest`)
- **Model**: `gpt-4.1` (can be changed in script)
- **API Key**: Read from `/materials/API/HKBUkey.md`

## Output Format

Each converted PDF will have:
- Page separators (`## Page N`)
- Properly formatted markdown
- All original content preserved
- Clean structure suitable for documentation

## Monitoring Progress

Check `process.log` for real-time updates:

```bash
tail -f /Users/simonwang/Documents/Usage/UE1/materials/API/process.log
```

The log shows:
- Files being processed
- Pages extracted
- Pages sent to LLM
- Pages formatted successfully
- Final output locations

## Notes

- The script skips the `MD` output folder when scanning for PDFs
- Rate limiting: 0.5 second delay between API calls
- If API call fails, original markdown is preserved
- All errors are logged to `process.log`
