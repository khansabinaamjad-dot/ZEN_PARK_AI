import cv2
import numpy as np

def detect_slots(image_path):
    image = cv2.imread(image_path)
    if image is None:
        return {"error": "Image not found"}

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 50, 150)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    slots = []
    for i, contour in enumerate(contours):
        area = cv2.contourArea(contour)
        if area > 1500:
            x, y, w, h = cv2.boundingRect(contour)
            slots.append({
                "slot": f"S{i+1}",
                "x": int(x),
                "y": int(y),
                "w": int(w),
                "h": int(h),
                "status": "Unknown"
            })

    return {"slots": slots}

if __name__ == "__main__":
    result = detect_slots("parking.jpg")
    print(result)