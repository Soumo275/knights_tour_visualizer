import matplotlib.pyplot as plt
import numpy as np
import time

# Chessboard dimensions
N = 8

# Possible moves for a knight
moves_x = [2, 1, -1, -2, -2, -1, 1, 2]
moves_y = [1, 2, 2, 1, -1, -2, -2, -1]

def is_safe(x, y, board):
    return 0 <= x < N and 0 <= y < N and board[x][y] == -1

def count_onward_moves(x, y, board):
    """Counts the number of onward moves from position (x, y)."""
    count = 0
    for i in range(8):
        next_x = x + moves_x[i]
        next_y = y + moves_y[i]
        if is_safe(next_x, next_y, board):
            count += 1
    return count

def sort_moves_by_priority(x, y, board):
    """Sort moves based on the number of onward moves (Warnsdorff's Rule)."""
    move_options = []
    for i in range(8):
        next_x = x + moves_x[i]
        next_y = y + moves_y[i]
        if is_safe(next_x, next_y, board):
            onward_moves = count_onward_moves(next_x, next_y, board)
            move_options.append((onward_moves, next_x, next_y))
    move_options.sort()  # Sort by least onward moves
    return [(nx, ny) for _, nx, ny in move_options]

def solve_knight_tour(board, curr_x, curr_y, move_count, update_visual):
    if move_count == N * N:
        return True

    for next_x, next_y in sort_moves_by_priority(curr_x, curr_y, board):
        board[next_x][next_y] = move_count
        update_visual(board)  # Update visualization
        if solve_knight_tour(board, next_x, next_y, move_count + 1, update_visual):
            return True
        board[next_x][next_y] = -1  # Backtrack
    return False

def knight_tour_visualizer(start_x=0, start_y=0):
    board = np.full((N, N), -1)
    board[start_x][start_y] = 0

    # Setup Matplotlib visualization
    plt.ion()
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.set_xticks(np.arange(-0.5, N, 1))
    ax.set_yticks(np.arange(-0.5, N, 1))
    ax.set_xticklabels([])
    ax.set_yticklabels([])
    ax.grid(color='black', linestyle='-', linewidth=2)
    ax.set_title("Knight's Tour Visualizer")

    # Update visualization function
    def update_visual(board):
        ax.clear()
        ax.matshow(board, cmap="viridis", alpha=0.8)
        for i in range(N):
            for j in range(N):
                if board[i][j] != -1:
                    ax.text(j, i, f"{board[i][j]}", va='center', ha='center', color='white')
        plt.draw()
        plt.pause(0.1)  # Non-blocking pause to update the GUI

    if solve_knight_tour(board, start_x, start_y, 1, update_visual):
        print("Knight's Tour Completed!")
    else:
        print("No solution found.")

    plt.ioff()
    plt.show()

# Run the visualizer
knight_tour_visualizer()
