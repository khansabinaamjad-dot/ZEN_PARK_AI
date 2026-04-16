import re
import sys
import cv2
import pytesseract

def extract_plate(text):
    cleaned = re.sub(r'[^A-Z0-9]', '', text.upper())
    patterns = [
        r'[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}',
        r'[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}'
    ]
    for pattern in patterns:
        match = re.search(pattern, cleaned)
        if match:
            return match.group(0)
    return None

def detect_plate(image_path):
    image = cv2.imread(image_path)
    if image is None:
        return {"plate": None, "message": "Image not found"}

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray)
    plate = extract_plate(text)

    return {
        "plate": plate,
        "raw_text": text
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python detectPlate.py image.jpg")
        sys.exit(1)

    result = detect_plate(sys.argv[1])
    print(result)