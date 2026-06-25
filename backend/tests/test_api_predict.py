from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

# Anchor IDs from the frozen demo fixture (deterministic generator):
#   PRV51001 → clean (p < 0.35)   PRV51021 → borderline   PRV51031 → fraud (p > 0.65)
CLEAN_ID = "PRV51001"
BORDERLINE_ID = "PRV51021"
FRAUD_ID = "PRV51031"


def test_demo_providers_returns_50():
    r = client.get("/api/demo-providers")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 50
    labels = {prov["predicted_label"] for prov in data}
    assert labels == {"clean", "borderline", "fraud"}


def test_demo_providers_distribution():
    r = client.get("/api/demo-providers")
    data = r.json()
    counts = {"clean": 0, "borderline": 0, "fraud": 0}
    for prov in data:
        counts[prov["predicted_label"]] += 1
    assert counts == {"clean": 20, "borderline": 10, "fraud": 20}


def test_predict_clean_routes_direct_clear():
    r = client.post("/api/predict", json={"provider_id": CLEAN_ID})
    assert r.status_code == 200
    body = r.json()
    assert body["provider_id"] == CLEAN_ID
    assert body["decision"] == "clear"
    assert body["routing"]["path"] == "direct"
    assert body["fraud_probability"] < 0.35
    assert body["shap"]["base_value"] == -2.3
    assert len(body["shap"]["contributions"]) == 8
    assert body["rationale"] is None


def test_predict_borderline_escalates_to_siu():
    r = client.post("/api/predict", json={"provider_id": BORDERLINE_ID})
    assert r.status_code == 200
    body = r.json()
    assert body["decision"] == "review"
    assert body["routing"]["path"] == "siu_review"
    assert body["rationale"] is not None
    assert body["rationale"]["risk_level"] == "medium"
    assert body["rationale"]["recommended_action"] == "review"


def test_predict_fraud_routes_direct_investigate():
    r = client.post("/api/predict", json={"provider_id": FRAUD_ID})
    assert r.status_code == 200
    body = r.json()
    assert body["decision"] == "investigate"
    assert body["routing"]["path"] == "direct"
    assert body["fraud_probability"] > 0.65


def test_predict_unknown_provider_returns_404():
    r = client.post("/api/predict", json={"provider_id": "PRV_DOES_NOT_EXIST"})
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
