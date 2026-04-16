import pandas as pd
from sklearn.linear_model import LinearRegression

def train_prediction_model(csv_path="parking_history.csv"):
    df = pd.read_csv(csv_path)

    if "hour" not in df.columns or "vehicles" not in df.columns:
        return "CSV must contain 'hour' and 'vehicles' columns"

    X = df[["hour"]]
    y = df["vehicles"]

    model = LinearRegression()
    model.fit(X, y)

    predictions = model.predict(X)
    df["predicted_vehicles"] = predictions.round(0)

    peak_hour = int(df.loc[df["predicted_vehicles"].idxmax(), "hour"])
    peak_value = int(df["predicted_vehicles"].max())

    return {
        "peak_hour": peak_hour,
        "expected_vehicles": peak_value,
        "rows": df.to_dict(orient="records")
    }

if __name__ == "__main__":
    result = train_prediction_model()
    print(result)