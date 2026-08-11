/// Alithea — Pathfinder (Route Memory)
/// Memorize the path, trace it back!
module alithea::pathfinder {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use sui::event;
    use std::vector;

    // ============ CONSTANTS ============

    const STATUS_PLAYING: u8 = 1;
    const STATUS_COMPLETED: u8 = 2;
    const STATUS_FAILED: u8 = 3;

    const BASE_SCORE: u64 = 100;
    const ROUND_BONUS: u64 = 50;
    const STEP_BONUS: u64 = 15;

    // ============ STRUCTS ============

    /// Pathfinder game session
    public struct PathGame has key, store {
        id: UID,
        player: address,
        grid_size: u8,
        path: vector<u8>,
        current_round: u64,
        score: u64,
        status: u8,
        start_time: u64,
    }

    // ============ EVENTS ============

    public struct GameCreated has copy, drop {
        game_id: ID,
        player: address,
        grid_size: u8,
    }

    public struct RoundCompleted has copy, drop {
        game_id: ID,
        round: u64,
        score: u64,
    }

    public struct GameOver has copy, drop {
        game_id: ID,
        player: address,
        rounds_survived: u64,
        final_score: u64,
    }

    // ============ ENTRY FUNCTIONS ============

    /// Create a new Pathfinder game
    public entry fun create_game(
        grid_size: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        let total_cells = get_total_cells(grid_size);

        // Generate initial path (3 steps)
        let path = generate_path(3, grid_size, total_cells, ctx);

        let game = PathGame {
            id: object::new(ctx),
            player,
            grid_size,
            path,
            current_round: 1,
            score: 0,
            status: STATUS_PLAYING,
            start_time: clock::timestamp_ms(clock),
        };

        event::emit(GameCreated {
            game_id: object::id(&game),
            player,
            grid_size,
        });

        transfer::public_transfer(game, player);
    }

    /// Submit player's attempt for current round
    public entry fun submit_attempt(
        game: &mut PathGame,
        player_path: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(game.status == STATUS_PLAYING, 0);
        assert!(tx_context::sender(ctx) == game.player, 1);

        let is_correct = check_path(&game.path, &player_path);

        if (is_correct) {
            let path_len = vector::length(&game.path) as u64;
            let round_score = ROUND_BONUS + path_len * STEP_BONUS;
            game.score = game.score + round_score;

            event::emit(RoundCompleted {
                game_id: object::id(game),
                round: game.current_round,
                score: game.score,
            });

            game.current_round = game.current_round + 1;

            // Generate longer path
            let total_cells = get_total_cells(game.grid_size);
            let mut new_path_len = vector::length(&game.path) + 1;
            let max_path = (total_cells * 5) / 10; // Max 50% of cells
            if (new_path_len > max_path) {
                new_path_len = max_path;
            };
            game.path = generate_path(new_path_len, game.grid_size, total_cells, ctx);

            // Check max rounds
            if (game.current_round > 15) {
                game.status = STATUS_COMPLETED;
                emit_game_over(game);
            };
        } else {
            game.status = STATUS_FAILED;
            emit_game_over(game);
        };
    }

    /// Get current path (for display during showing phase)
    public fun get_path(game: &PathGame): &vector<u8> {
        &game.path
    }

    /// Get game state
    public fun get_state(game: &PathGame): (u8, u64, u64, u64, u8) {
        (
            game.grid_size,
            game.current_round,
            vector::length(&game.path),
            game.score,
            game.status,
        )
    }

    // ============ INTERNAL FUNCTIONS ============

    fun get_total_cells(grid_size: u8): u64 {
        let size = grid_size as u64;
        size * size
    }

    fun generate_path(length: u64, grid_size: u8, total_cells: u64, ctx: &mut TxContext): vector<u8> {
        let mut path = vector[];
        let tx_hash = tx_context::digest(ctx);
        let seed = (*vector::borrow(tx_hash, 0) as u64) + (*vector::borrow(tx_hash, 1) as u64) * 256;
        let grid = grid_size as u64;

        // Start from a random cell
        let start = (seed % total_cells) as u8;
        vector::push_back(&mut path, start);

        let mut current = start;
        let mut i: u64 = 1;
        while (i < length) {
            let row = (current as u64) / grid;
            let col = (current as u64) % grid;

            // Get valid neighbors
            let mut neighbors = vector[];
            if (row > 0) { vector::push_back(&mut neighbors, current - (grid as u8)); };
            if (row < grid - 1) { vector::push_back(&mut neighbors, current + (grid as u8)); };
            if (col > 0) { vector::push_back(&mut neighbors, current - 1); };
            if (col < grid - 1) { vector::push_back(&mut neighbors, current + 1); };

            // Pick a neighbor not in path
            let mut found = false;
            let mut j = 0;
            while (j < vector::length(&neighbors)) {
                let candidate = *vector::borrow(&neighbors, j);
                let mut in_path = false;
                let mut k = 0;
                while (k < vector::length(&path)) {
                    if (*vector::borrow(&path, k) == candidate) {
                        in_path = true;
                        break
                    };
                    k = k + 1;
                };
                if (!in_path) {
                    vector::push_back(&mut path, candidate);
                    current = candidate;
                    found = true;
                    break
                };
                j = j + 1;
            };

            if (!found) {
                break // No valid neighbors, stop growing path
            };
            i = i + 1;
        };
        path
    }

    fun check_path(expected: &vector<u8>, player_path: &vector<u8>): bool {
        let exp_len = vector::length(expected);
        let player_len = vector::length(player_path);

        if (exp_len != player_len) {
            return false
        };

        let mut i = 0;
        while (i < exp_len) {
            let exp_val = *vector::borrow(expected, i);
            let player_val = *vector::borrow(player_path, i);
            if (exp_val != player_val) {
                return false
            };
            i = i + 1;
        };

        true
    }

    fun emit_game_over(game: &PathGame) {
        event::emit(GameOver {
            game_id: object::id(game),
            player: game.player,
            rounds_survived: game.current_round - 1,
            final_score: game.score,
        });
    }

    // ============ TESTS ============

    #[test]
    fun test_get_total_cells() {
        assert!(get_total_cells(4) == 16, 0);
        assert!(get_total_cells(5) == 25, 1);
        assert!(get_total_cells(6) == 36, 2);
    }

    #[test]
    fun test_check_path() {
        let expected = vector[0, 1, 2, 3];
        let correct = vector[0, 1, 2, 3];
        let wrong = vector[0, 1, 2, 4];
        let short = vector[0, 1, 2];

        assert!(check_path(&expected, &correct) == true, 0);
        assert!(check_path(&expected, &wrong) == false, 1);
        assert!(check_path(&expected, &short) == false, 2);
    }
}
