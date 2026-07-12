/// Alithea — Chasing Stars (Spatial Memory)
/// Remember where the stars are, find them all!
module alithea::chasing_stars {
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
    const STAR_BONUS: u64 = 20;

    // ============ STRUCTS ============

    /// Chasing Stars game session
    public struct StarsGame has key, store {
        id: UID,
        player: address,
        grid_size: u8,
        star_positions: vector<u8>,
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

    /// Create a new Chasing Stars game
    public entry fun create_game(
        grid_size: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        let total_cells = get_total_cells(grid_size);

        // Generate initial star positions (2 stars)
        let star_positions = generate_stars(2, total_cells, ctx);

        let game = StarsGame {
            id: object::new(ctx),
            player,
            grid_size,
            star_positions,
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
        game: &mut StarsGame,
        player_input: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(game.status == STATUS_PLAYING, 0);
        assert!(tx_context::sender(ctx) == game.player, 1);

        // Check if all stars were found (input must contain all star positions)
        let is_correct = check_stars_found(&game.star_positions, &player_input);

        if (is_correct) {
            // Round passed!
            let star_count = vector::length(&game.star_positions) as u64;
            let round_score = ROUND_BONUS + star_count * STAR_BONUS;
            game.score = game.score + round_score;

            event::emit(RoundCompleted {
                game_id: object::id(game),
                round: game.current_round,
                score: game.score,
            });

            // Advance to next round
            game.current_round = game.current_round + 1;

            // Add more stars
            let total_cells = get_total_cells(game.grid_size);
            let new_star_count = vector::length(&game.star_positions) + 1;
            let max_stars = (total_cells * 6) / 10; // Max 60% of cells
            if (new_star_count > max_stars) {
                new_star_count = max_stars;
            };
            game.star_positions = generate_stars(new_star_count, total_cells, ctx);

            // Check max rounds
            if (game.current_round > 20) {
                game.status = STATUS_COMPLETED;
                emit_game_over(game);
            };
        } else {
            // Failed
            game.status = STATUS_FAILED;
            emit_game_over(game);
        };
    }

    /// Get star positions (for display during showing phase)
    public fun get_star_positions(game: &StarsGame): &vector<u8> {
        &game.star_positions
    }

    /// Get game state
    public fun get_state(game: &StarsGame): (u8, u64, u64, u64, u8) {
        (
            game.grid_size,
            game.current_round,
            vector::length(&game.star_positions),
            game.score,
            game.status,
        )
    }

    // ============ INTERNAL FUNCTIONS ============

    fun get_total_cells(grid_size: u8): u64 {
        let size = grid_size as u64;
        size * size
    }

    fun generate_stars(count: u64, total_cells: u64, ctx: &mut TxContext): vector<u8> {
        let mut stars = vector[];
        let tx_hash = tx_context::digest(ctx);
        let seed = (*vector::borrow(tx_hash, 0) as u64) + (*vector::borrow(tx_hash, 1) as u64) * 256;

        let mut i = 0;
        while (i < count) {
            let pos = ((seed + i * 7919 + (i as u64) * 31) % total_cells) as u8;
            // Ensure no duplicates
            let mut is_duplicate = false;
            let mut j = 0;
            while (j < vector::length(&stars)) {
                if (*vector::borrow(&stars, j) == pos) {
                    is_duplicate = true;
                    break
                };
                j = j + 1;
            };
            if (!is_duplicate) {
                vector::push_back(&mut stars, pos);
                i = i + 1;
            } else {
                // Try next position
                i = i + 1;
            };
        };
        stars
    }

    fun check_stars_found(star_positions: &vector<u8>, player_input: &vector<u8>): bool {
        // All star positions must be in player input
        let mut i = 0;
        while (i < vector::length(star_positions)) {
            let star = *vector::borrow(star_positions, i);
            let mut found = false;
            let mut j = 0;
            while (j < vector::length(player_input)) {
                if (*vector::borrow(player_input, j) == star) {
                    found = true;
                    break
                };
                j = j + 1;
            };
            if (!found) {
                return false
            };
            i = i + 1;
        };
        true
    }

    fun emit_game_over(game: &StarsGame) {
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
        assert!(get_total_cells(3) == 9, 0);
        assert!(get_total_cells(4) == 16, 1);
        assert!(get_total_cells(5) == 25, 2);
    }

    #[test]
    fun test_check_stars_found() {
        let stars = vector[0, 3, 7];
        let found = vector[0, 3, 7];
        let partial = vector[0, 3];
        let wrong = vector[0, 3, 5];

        assert!(check_stars_found(&stars, &found) == true, 0);
        assert!(check_stars_found(&stars, &partial) == false, 1);
        assert!(check_stars_found(&stars, &wrong) == false, 2);
    }
}
