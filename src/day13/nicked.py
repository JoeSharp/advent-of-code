# aoc202213.py
# https://pastebin.com/rXSWhQYJ
# I can't figure out what's wrong with mine yet, so taken this for reference

import json
import pathlib
import sys


def parse(puzzle_input: str) -> list[list[int, ...]]:
    """Convert str representations of lists into real int lists"""
    str_pkts: list[list[str, str]] = [
        packet.splitlines() for packet in puzzle_input.split("\n\n")
    ]
    int_pkts: list[list[int, ...]] = []
    for pkt in str_pkts:
        int_pk: list[int, ...] = []
        for pk in pkt:
            # Here's the magick - I'm highly averse to eval()
            int_pk.append(json.loads(pk))
        int_pkts.append(int_pk)
    return int_pkts


def compare(l: int, r: int) -> int:
    """Compare 2 ints, return 1, 0, -1 depending on values"""
    if l < r:
        return 1
    elif l > r:
        return -1
    else:
        return 0


def compare_packets(left: list[int, ...], right: list[int, ...]) -> int:
    """Compare 2 lists to establish correct order"""
    match left, right:
        case int(), int():
            return compare(left, right)
        case int(), list():
            return compare_packets([left], right)
        case list(), int():
            return compare_packets(left, [right])
        case list(), list():
            for l, r in zip(left, right):
                res = compare_packets(l, r)
                if res != 0:
                    return res
            return compare_packets(len(left), len(right))


def part1(pairs: list[list[int, ...]]) -> int:
    """Solve part 1"""
    sum_of_indices: int = 0
    for idx, pair in enumerate(pairs):
        if compare_packets(*pair) == 1:
            sum_of_indices += idx + 1
    return sum_of_indices


def flatten(l: list[list[int]]) -> list[int]:
    """Flatten a nested list one level"""
    return [item for sublist in l for item in sublist]


def find_index(l: list[list[int]], item: list[int]) -> int:
    """Return index of where item falls in list"""
    item_idx: int = 0
    for pkt in flatten(l):
        if compare_packets(pkt, item) == 1:
            item_idx += 1
    return item_idx


def part2(pairs: list[list[int, ...]]) -> int:
    """Solve part 2"""
    # Remove one layer of list to match flattened list above
    first_divider: list[int] = [2]
    second_divider: list[int] = [6]

    first_pos: int = find_index(pairs, first_divider) + 1
    second_pos: int = find_index(pairs, second_divider) + 2
    return first_pos * second_pos


def solve(puzzle_input: str) -> tuple[int, int]:
    """Solve the puzzle for the given input"""
    data: list[list[int, ...]] = parse(puzzle_input)
    solution1: int = part1(data)  # Correct answer was 4734 (with my data)
    solution2: int = part2(data)  # Correct answer was 21836 (with my data)

    return solution1, solution2


if __name__ == "__main__":
    for path in sys.argv[1:]:
        print(f"{path}:")
        puzzle_input = pathlib.Path(path).read_text().strip()
        solutions = solve(puzzle_input)
        print("\n".join(str(solution) for solution in solutions))