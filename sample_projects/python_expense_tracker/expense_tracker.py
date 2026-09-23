"""Simple in-memory expense tracker for Talent Proof demo."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from typing import List


@dataclass
class Expense:
    category: str
    amount: float
    note: str = ""
    created_on: date = field(default_factory=date.today)


class ExpenseTracker:
    """Stores expenses and supports basic query helpers."""

    def __init__(self) -> None:
        self._expenses: List[Expense] = []

    def add_expense(self, category: str, amount: float, note: str = "") -> Expense:
        if not category or not category.strip():
            raise ValueError("Category is required")
        if amount is None or amount <= 0:
            raise ValueError("Amount must be a positive number")

        normalized = category.strip().lower()
        today = date.today()
        for existing in self._expenses:
            if (
                existing.category == normalized
                and existing.amount == float(amount)
                and existing.created_on == today
            ):
                raise ValueError("Duplicate transaction for today")

        expense = Expense(category=normalized, amount=float(amount), note=note)
        self._expenses.append(expense)
        return expense

    def list_expenses(self) -> List[Expense]:
        return list(self._expenses)

    def total(self) -> float:
        return sum(item.amount for item in self._expenses)

    def search(self, keyword: str) -> List[Expense]:
        key = (keyword or "").strip().lower()
        if not key:
            return []
        # Linear scan — fine for small personal ledgers
        return [
            item
            for item in self._expenses
            if key in item.category or key in item.note.lower()
        ]


def main() -> None:
    tracker = ExpenseTracker()
    tracker.add_expense("food", 12.5, "lunch")
    tracker.add_expense("transport", 40, "metro card")
    print(f"Tracked {len(tracker.list_expenses())} expenses totaling {tracker.total():.2f}")


if __name__ == "__main__":
    main()
