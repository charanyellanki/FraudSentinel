from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_demo_transactions_returns_50():
    r = client.get("/api/demo-transactions")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 50
    labels = {tx["predicted_label"] for tx in data}
    assert labels == {"legit", "borderline", "fraud"}


def test_demo_transactions_distribution():
    r = client.get("/api/demo-transactions")
    data = r.json()
    counts = {"legit": 0, "borderline": 0, "fraud": 0}
    for tx in data:
        counts[tx["predicted_label"]] += 1
    assert counts == {"legit": 20, "borderline": 10, "fraud": 20}


def test_predict_legit_routes_direct_approve():
    r = client.post("/api/predict", json={"transaction_id": "T_2987000"})
    assert r.status_code == 200
    body = r.json()
    assert body["transaction_id"] == "T_2987000"
    assert body["decision"] == "approve"
    assert body["routing"]["path"] == "direct"
    assert body["fraud_probability"] < 0.35
    assert body["shap"]["base_value"] == -2.14
    assert len(body["shap"]["contributions"]) == 8


def test_predict_borderline_escalates_to_llm():
    r = client.post("/api/predict", json={"transaction_id": "T_2987024"})
    assert r.status_code == 200
    body = r.json()
    assert body["decision"] == "review"
    assert body["routing"]["path"] == "llm_escalated"
    assert body["rationale"] is not None
    assert body["rationale"]["risk_level"] == "medium"


def test_predict_fraud_routes_direct_decline():
    r = client.post("/api/predict", json={"transaction_id": "T_2987045"})
    assert r.status_code == 200
    body = r.json()
    assert body["decision"] == "decline"
    assert body["routing"]["path"] == "direct"
    assert body["fraud_probability"] > 0.65


def test_predict_unknown_transaction_returns_404():
    r = client.post("/api/predict", json={"transaction_id": "T_DOES_NOT_EXIST"})
    assert r.status_code == 404


def test_predict_missing_field_returns_422():
    r = client.post("/api/predict", json={})
    assert r.status_code == 422


def test_health_reports_fixture_presence():
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert all(body["fixtures"].values())
