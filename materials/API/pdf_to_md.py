#!/usr/bin/env python3
"""
PDF to Markdown Converter with HKBU Gen AI API Formatting
Converts PDFs to markdown, formats them via LLM, and saves to MD folder
"""

import os
import sys
import json
import time
from pathlib import Path
from datetime import datetime
import requests

# Try to import PDF libraries
try:
    import pypdf
    PDF_LIB = 'pypdf'
except ImportError:
    try:
        import PyPDF2
        PDF_LIB = 'PyPDF2'
    except ImportError:
        try:
            import pdfplumber
            PDF_LIB = 'pdfplumber'
        except ImportError:
            print("ERROR: No PDF library found. Please install one of: pypdf, PyPDF2, or pdfplumber")
            sys.exit(1)

# Configuration
MATERIALS_DIR = Path("/Users/simonwang/Documents/Usage/UE1/materials")
API_KEY_FILE = MATERIALS_DIR / "API" / "HKBUkey.md"
OUTPUT_DIR = MATERIALS_DIR / "MD"
LOG_FILE = MATERIALS_DIR / "API" / "process.log"
BASE_URL = "https://genai.hkbu.edu.hk/api/v0/rest"
MODEL = "gpt-4.1"  # Using GPT-4.1 for formatting

def log(message):
    """Write message to log file and print to console"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_message = f"[{timestamp}] {message}\n"
    print(log_message.strip())
    try:
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(log_message)
    except Exception as e:
        print(f"Warning: Could not write to log file: {e}")

def read_api_key():
    """Read API key from HKBUkey.md"""
    try:
        with open(API_KEY_FILE, 'r', encoding='utf-8') as f:
            key = f.read().strip()
        if not key:
            raise ValueError("API key file is empty")
        return key
    except Exception as e:
        log(f"ERROR: Could not read API key: {e}")
        sys.exit(1)

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF, returning list of pages"""
    log(f"Extracting text from: {pdf_path.name}")
    pages = []
    
    try:
        if PDF_LIB == 'pypdf':
            with open(pdf_path, 'rb') as f:
                reader = pypdf.PdfReader(f)
                for i, page in enumerate(reader.pages):
                    text = page.extract_text()
                    pages.append({
                        'page_num': i + 1,
                        'text': text
                    })
        elif PDF_LIB == 'PyPDF2':
            with open(pdf_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for i, page in enumerate(reader.pages):
                    text = page.extract_text()
                    pages.append({
                        'page_num': i + 1,
                        'text': text
                    })
        elif PDF_LIB == 'pdfplumber':
            with pdfplumber.open(pdf_path) as pdf:
                for i, page in enumerate(pdf.pages):
                    text = page.extract_text()
                    pages.append({
                        'page_num': i + 1,
                        'text': text or ""
                    })
        
        log(f"Extracted {len(pages)} pages from {pdf_path.name}")
        return pages
    except Exception as e:
        log(f"ERROR extracting from {pdf_path.name}: {e}")
        return []

def convert_to_markdown(text):
    """Basic conversion to markdown format"""
    # Basic markdown conversion - preserve structure
    lines = text.split('\n')
    md_lines = []
    for line in lines:
        line = line.strip()
        if line:
            md_lines.append(line)
        else:
            md_lines.append('')
    return '\n'.join(md_lines)

def format_with_llm(markdown_text, api_key, page_num, total_pages):
    """Send markdown text to HKBU Gen AI API for formatting"""
    log(f"  Sending page {page_num}/{total_pages} to LLM for formatting...")
    
    url = f"{BASE_URL}/deployments/{MODEL}/chat/completions"
    headers = {
        "api-key": api_key,
        "Content-Type": "application/json"
    }
    
    payload = {
        "messages": [
            {
                "role": "system",
                "content": "You are a careful markdown formatter for university teaching materials. Format the provided text into clean, well-structured Markdown. Preserve ALL content including headings, lists, tables, examples, and citations. Fix formatting issues, ensure proper markdown syntax, and maintain proper spacing. Do not summarize, omit, or add commentary - only return the formatted Markdown."
            },
            {
                "role": "user",
                "content": f"Format the following markdown text. Preserve all content exactly, only improve the formatting:\n\n{markdown_text}"
            }
        ],
        "max_tokens": 4000,
        "temperature": 0.3
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        
        formatted_text = result['choices'][0]['message']['content']
        
        # Remove markdown code block wrapper if present
        if formatted_text.startswith('```markdown'):
            formatted_text = formatted_text[11:]  # Remove ```markdown
        elif formatted_text.startswith('```'):
            formatted_text = formatted_text[3:]  # Remove ```
        
        if formatted_text.endswith('```'):
            formatted_text = formatted_text[:-3]  # Remove closing ```
        
        formatted_text = formatted_text.strip()
        
        log(f"  ✓ Page {page_num}/{total_pages} formatted successfully")
        return formatted_text
    except requests.exceptions.RequestException as e:
        log(f"  ✗ ERROR formatting page {page_num}: {e}")
        # Return original text if API call fails
        return markdown_text
    except Exception as e:
        log(f"  ✗ ERROR processing response for page {page_num}: {e}")
        return markdown_text

def process_pdf(pdf_path, api_key):
    """Process a single PDF file"""
    log(f"\n{'='*70}")
    log(f"Processing: {pdf_path.name}")
    log(f"{'='*70}")
    
    # Extract text from PDF
    pages = extract_text_from_pdf(pdf_path)
    if not pages:
        log(f"ERROR: No pages extracted from {pdf_path.name}")
        return False
    
    # Convert to markdown and format each page
    formatted_pages = []
    total_pages = len(pages)
    
    for page_data in pages:
        page_num = page_data['page_num']
        text = page_data['text']
        
        # Convert to basic markdown
        md_text = convert_to_markdown(text)
        
        # Format with LLM
        formatted_md = format_with_llm(md_text, api_key, page_num, total_pages)
        formatted_pages.append({
            'page_num': page_num,
            'content': formatted_md
        })
        
        # Small delay to avoid rate limiting
        time.sleep(0.5)
    
    # Consolidate all pages
    log(f"Consolidating {total_pages} pages...")
    consolidated = []
    for page in formatted_pages:
        consolidated.append(f"## Page {page['page_num']}\n\n{page['content']}\n\n---\n\n")
    
    final_markdown = "".join(consolidated)
    
    # Save to output directory
    output_filename = pdf_path.stem + ".md"
    output_path = OUTPUT_DIR / output_filename
    
    try:
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(final_markdown)
        log(f"✓ Saved formatted markdown to: {output_path.name}")
        return True
    except Exception as e:
        log(f"ERROR saving {output_filename}: {e}")
        return False

def find_pdfs(directory):
    """Find all PDF files in directory and subdirectories"""
    pdfs = []
    for root, dirs, files in os.walk(directory):
        # Skip the MD output directory
        if 'MD' in root:
            continue
        for file in files:
            if file.lower().endswith('.pdf'):
                pdfs.append(Path(root) / file)
    return pdfs

def main():
    """Main processing function"""
    log("\n" + "="*70)
    log("PDF to Markdown Converter - Starting")
    log("="*70)
    
    # Read API key
    log("Reading API key...")
    api_key = read_api_key()
    log("✓ API key loaded")
    
    # Find all PDFs
    log(f"\nScanning for PDFs in: {MATERIALS_DIR}")
    pdfs = find_pdfs(MATERIALS_DIR)
    log(f"Found {len(pdfs)} PDF file(s)")
    
    if not pdfs:
        log("No PDF files found. Exiting.")
        return
    
    # Process each PDF
    successful = 0
    failed = 0
    
    for i, pdf_path in enumerate(pdfs, 1):
        log(f"\n[{i}/{len(pdfs)}] Processing: {pdf_path.relative_to(MATERIALS_DIR)}")
        try:
            if process_pdf(pdf_path, api_key):
                successful += 1
            else:
                failed += 1
        except Exception as e:
            log(f"ERROR processing {pdf_path.name}: {e}")
            failed += 1
    
    # Summary
    log("\n" + "="*70)
    log("Processing Complete")
    log("="*70)
    log(f"Total PDFs: {len(pdfs)}")
    log(f"Successful: {successful}")
    log(f"Failed: {failed}")
    log("="*70 + "\n")

if __name__ == "__main__":
    main()

