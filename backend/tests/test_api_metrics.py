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
    assert set(body["fnr_by_volume_tier"].keys()) == {
        "Q1 (lowest)",
        "Q2",
        "Q3",
        "Q4",
        "Q5 (highest)",
    }


def test_model_comparison_lists_all_four_models():
    r = client.get("/api/model-comparison")
    assert r.status_code == 200
    body = r.json()
    names = {m["name"] for m in body["models"]}
    assert names == {"LightGBM", "XGBoost", "CatBoost", "Logistic Regression"}
    assert body["winner"] == "LightGBM"


def test_llm_comparison_benchmarks_three_rationale_models():
    r = client.get("/api/llm-comparison")
    assert r.status_code == 200
    body = r.json()
    names = {m["name"] for m in body["models"]}
    assert names == {"Llama 3.1 8B (QLoRA)", "Qwen 2.5 7B", "GPT-4o-mini"}
    assert body["winner"] == "Llama 3.1 8B (QLoRA)"
    for m in body["models"]:
        assert 1.0 <= m["faithfulness"] <= 5.0
        assert m["cost_per_1k_usd"] > 0


def test_drift_returns_4_windows_with_20_features():
    r = client.get("/api/drift")
    assert r.status_code == 200
    body = r.json()
    assert len(body["windows"]) == 4
    for w in body["windows"]:
        assert len(w["features"]) == 20
