import json
import logging
from functools import lru_cache

from app.config import settings
from app.schemas.metrics import EvalMetrics, ModelComparison

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_eval_metrics() -> EvalMetrics:
    with settings.eval_metrics_path.open() as f:
        data = json.load(f)
    return EvalMetrics(**data)


@lru_cache(maxsize=1)
def get_model_comparison() -> ModelComparison:
    with settings.model_comparison_path.open() as f:
        data = json.load(f)
    return ModelComparison(**data)
