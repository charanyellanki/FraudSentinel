import json
import logging
from functools import lru_cache

from app.config import settings
from app.schemas.metrics import DriftReport

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_drift_report() -> DriftReport:
    with settings.drift_report_path.open() as f:
        data = json.load(f)
    return DriftReport(**data)
