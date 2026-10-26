## What it's for

`TODO`s and `FIXME`s pile up and fade from the team's memory. This script counts them, by type and by file, so you can decide which to handle before a release. It only counts markers located **inside a comment**: a string that contains "TODO" is not counted.

## Before you start

- A code folder. `node_modules`, `.git`, build folders and binary files are skipped.

## Step by step

1. Take inventory:
   ```bash
   node src/todo-scan.mjs ./src
   ```
2. Look at the busiest files (shown at the end of the report): they are often where technical debt lives.
3. For a dashboard or a script, use `--json`.

## Reading the output

The markers: `TODO` (to do), `FIXME` (broken or wrong), `HACK` (workaround), `XXX` (careful), `BUG` (known defect). Each line gives `file:line` and the text.

## Automating it

Set a ceiling: `--max 50` fails CI if the total goes above it, so debt cannot grow without someone deciding it should.

## Pitfalls

- A ceiling set too low on day one will be worked around: start from the current total and bring it down.
- A `TODO` with no description helps nobody: write what needs doing and why.
