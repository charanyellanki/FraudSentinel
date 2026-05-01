from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_metrics_returns_evaluation_summary():
    r = client.get("/api/metrics")
    assert r.status_code == 200
    body = r.json()
    assert 0.0 <= body["roc_auc"] <= 1.0
    assert 0.0 <= body["pr_auc"] <= 1.0
    assert "confusion_matrix" in body
    assert len(body["roc_curve"]) >= 10
    assert len(body["pr_curve"]) >= 10
    assert set(body["fnr_by_merchant"].keys()) == {"W", "C", "R", "H", "S"}


def test_model_comparison_lists_all_four_models():
    r = client.get("/api/model-comparison")
    assert r.status_code == 200
    body = r.json()
    names = {m["name"] for m in body["models"]}
    assert names == {"LightGBM", "XGBoost", "CatBoost", "Logistic Regression"}
    assert body["winner"] == "LightGBM"


def test_drift_returns_4_windows_with_20_features():
    r = client.get("/api/drift")
    assert r.status_code == 200
    body = r.json()
    assert len(body["windows"]) == 4
    for w in body["windows"]:
        assert len(w["features"]) == 20
