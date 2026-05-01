from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "FraudSentinel API"
    app_version: str = "0.1.0"
    debug: bool = False

    # CORS
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]
    cors_origin_regex: str = r"https://.*\.vercel\.app"

    # Confidence router thresholds.
    # Placeholder values — empirically tuned after the cost-vs-escalation sweep.
    router_low_threshold: float = 0.35  # p < this → direct approve
    router_high_threshold: float = 0.65  # p > this → direct decline

    # Fixture paths
    fixtures_dir: Path = Path(__file__).parent / "fixtures"

    @property
    def demo_transactions_path(self) -> Path:
        return self.fixtures_dir / "demo_transactions.json"

    @property
    def rationales_path(self) -> Path:
        return self.fixtures_dir / "rationales.json"

    @property
    def eval_metrics_path(self) -> Path:
        return self.fixtures_dir / "eval_metrics.json"

    @property
    def model_comparison_path(self) -> Path:
        return self.fixtures_dir / "model_comparison.json"

    @property
    def drift_report_path(self) -> Path:
        return self.fixtures_dir / "drift_report.json"


settings = Settings()
