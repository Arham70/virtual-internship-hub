# Domain questions data

Place `domain_questions.json` here (or use `--file` with the load command).

## JSON format

```json
{
  "domains": [
    {
      "code": "WEB_DEVELOPMENT",
      "questions": [
        {
          "text": "Question text?",
          "option_a": "Option A",
          "option_b": "Option B",
          "option_c": "Option C",
          "option_d": "Option D",
          "correct_option": "A",
          "complexity": "EASY",
          "points": 1
        }
      ]
    }
  ]
}
```

- `code`: Must match an existing domain code (run `python manage.py populate_domains` first).
- `complexity`: One of `EASY`, `MEDIUM`, `HARD`.
- `correct_option`: One of `A`, `B`, `C`, `D`.
- `points`: Integer (default 1).

## Load questions

From backend directory:

```bash
python manage.py load_domain_questions
```

Custom file:

```bash
python manage.py load_domain_questions --file path/to/domain_questions.json
```

Dry run (no DB insert):

```bash
python manage.py load_domain_questions --dry-run
```
