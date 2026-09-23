import unittest

from expense_tracker import ExpenseTracker


class ExpenseTrackerTests(unittest.TestCase):
    def test_add_and_total(self):
        tracker = ExpenseTracker()
        tracker.add_expense("food", 10)
        tracker.add_expense("books", 25.5)
        self.assertEqual(len(tracker.list_expenses()), 2)
        self.assertAlmostEqual(tracker.total(), 35.5)

    def test_rejects_invalid_amount(self):
        tracker = ExpenseTracker()
        with self.assertRaises(ValueError):
            tracker.add_expense("food", -5)

    def test_prevents_duplicate_same_day(self):
        tracker = ExpenseTracker()
        tracker.add_expense("food", 10, "lunch")
        with self.assertRaises(ValueError):
            tracker.add_expense("food", 10, "lunch again")

    def test_search_by_keyword(self):
        tracker = ExpenseTracker()
        tracker.add_expense("food", 10, "pizza")
        tracker.add_expense("rent", 500, "april")
        hits = tracker.search("piz")
        self.assertEqual(len(hits), 1)
        self.assertEqual(hits[0].category, "food")


if __name__ == "__main__":
    unittest.main()
