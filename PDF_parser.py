import requests
import pdfplumber
import re
import json
from io import BytesIO

def download_pdf(pdf_url):
    response = requests.get(pdf_url)
    if response.status_code == 200:
        return BytesIO(response.content)
    else:
        raise Exception(f"Failed to download PDF: {response.status_code}")

def extract_text_from_pdf(pdf_stream):
    text = ""
    with pdfplumber.open(pdf_stream) as pdf:
        for page in pdf.pages:
            extracted_text = page.extract_text()
            if extracted_text:
                text += extracted_text + "\n"
    return text

def parse_questions(text):
    # Adjusted regex to capture full correct answer
    question_pattern = re.compile(
        r"(\d+\..*?)\n(a\) .*?)\n(b\) .*?)\n(c\) .*?)\n(d\) .*?)\nAnswer:\s*([a-d]\))",
        re.DOTALL
    )

    questions = []

    for match in question_pattern.findall(text):
        question_text = match[0].strip()
        options = [{"name": match[i].strip()} for i in range(1, 5)]
        
        # Extract correct answer based on the answer letter (a), (b), (c), (d)
        correct_letter = match[5].strip()  # Example: "c)"
        correct_ans = next(option["name"] for option in options if option["name"].startswith(correct_letter))

        questions.append({
            "question": question_text,
            "options": options,
            "correctAns": correct_ans  # Full correct answer text
        })

    return questions

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python pdf_parser.py <PDF_URL>"}))
        sys.exit(1)

    pdf_url = sys.argv[1]

    try:
        pdf_stream = download_pdf(pdf_url)
        pdf_text = extract_text_from_pdf(pdf_stream)
        questions = parse_questions(pdf_text)
        print(json.dumps({"data": questions}, indent=4))  # Pretty print JSON
    except Exception as e:
        print(json.dumps({"error": str(e)}))
