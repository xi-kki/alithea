/// Alithea — Pattern Echo (Simon Says)
/// Watch the pattern, repeat it back!
module alithea::pattern_echo {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use sui::event;
    use std::vector;
    use std::option;

    // ============ CONSTANTS ============
    
    const STATUS_PLAYING: u8 = 1;
    const STATUS_COMPLETED: u8 = 2;
    const STATUS_FAILED: u8 = 3;

    const GRID_3X3: u8 = 0;
    const GRID_4X4: u8 = 1;

    const BASE_SCORE: u64 = 100;
    const ROUND_BONUS: u64 = 50;
    const SPEED_BONUS: u64 = 25;

    // ============ STRUCTS ============

    /// Pattern Echo game session
    public struct PatternGame has key, store {
        id: UID,
        player: address,
        grid_size: u8,
        sequence: vector<u8>,
        current_round: u64,
        max_rounds: u64,
        speed_ms: u64,
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

    /// Create a new Pattern Echo game
    public entry fun create_game(
        grid_size: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        let total_cells = get_total_cells(grid_size);
        
        // Generate initial sequence (3 items)
        let sequence = generate_initial_sequence(total_cells, ctx);

        let game = PatternGame {
            id: object::new(ctx),
            player,
            grid_size,
            sequence,
            current_round: 1,
            max_rounds: 50,
            speed_ms: 1000,
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
        game: &mut PatternGame,
        player_input: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(game.status == STATUS_PLAYING, 0);
        assert!(tx_context::sender(ctx) == game.player, 1);

        // Check if input matches sequence
        let is_correct = check_input(&game.sequence, &player_input);

        if (is_correct) {
            // Round passed!
            game.score = game.score + ROUND_BONUS + calculate_speed_bonus(game, clock);
            
            event::emit(RoundCompleted {
                game_id: object::id(game),
                round: game.current_round,
                score: game.score,
            });

            // Advance to next round
            game.current_round = game.current_round + 1;
            
            // Add new item to sequence
            let total_cells = get_total_cells(game.grid_size);
            let new_item = generate_random_item(total_cells, ctx);
            vector::push_back(&mut game.sequence, new_item);
            
            // Increase speed (make it harder)
            if (game.speed_ms > 200) {
                game.speed_ms = game.speed_ms - 50;
            };

            // Check if max rounds reached
            if (game.current_round > game.max_rounds) {
                game.status = STATUS_COMPLETED;
                emit_game_over(game);
            };
        } else {
            // Failed - game over
            game.status = STATUS_FAILED;
            emit_game_over(game);
        };
    }

    /// Get current sequence (for display during pattern reveal)
    public fun get_sequence(game: &PatternGame): &vector<u8> {
        &game.sequence
    }

    /// Get game state
    public fun get_state(game: &PatternGame): (u8, u64, u64, u64, u64, u8) {
        (
            game.grid_size,
            game.current_round,
            game.max_rounds,
            game.speed_ms,
            game.score,
            game.status,
        )
    }

    /// Get sequence length
    public fun get_sequence_length(game: &PatternGame): u64 {
        vector::length(&game.sequence)
    }

    // ============ INTERNAL FUNCTIONS ============

    fun get_total_cells(grid_size: u8): u64 {
        if (grid_size == GRID_3X3) {
            9
        } else {
            16
        }
    }

    fun generate_initial_sequence(total_cells: u64, ctx: &mut TxContext): vector<u8> {
        let mut sequence = vector[];
        let mut i = 0;
        while (i < 3) {
            let item = generate_random_item(total_cells, ctx);
            vector::push_back(&mut sequence, item);
            i = i + 1;
        };
        sequence
    }

    fun generate_random_item(max: u64, ctx: &mut TxContext): u8 {
        let tx_hash = tx_context::digest(ctx);
        let seed = (*vector::borrow(tx_hash, 0) as u64) + (*vector::borrow(tx_hash, 1) as u64) * 256;
        let idx = sui::tx_context::epoch(ctx);
        ((seed + idx * 31) % max) as u8
    }

    fun check_input(sequence: &vector<u8>, input: &vector<u8>): bool {
        let seq_len = vector::length(sequence);
        let input_len = vector::length(input);
        
        // Input must match sequence length for current round
        if (input_len != seq_len) {
            return false
        };

        let mut i = 0;
        while (i < seq_len) {
            let seq_val = *vector::borrow(sequence, i);
            let input_val = *vector::borrow(input, i);
            if (seq_val != input_val) {
                return false
            };
            i = i + 1;
        };
        
        true
    }

    fun calculate_speed_bonus(game: &PatternGame, clock: &Clock): u64 {
        let _elapsed = clock::timestamp_ms(clock) - game.start_time;
        // Simplified speed bonus
        if (game.speed_ms < 500) {
            SPEED_BONUS
        } else {
            0
        }
    }

    fun emit_game_over(game: &PatternGame) {
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
        assert!(get_total_cells(GRID_3X3) == 9, 0);
        assert!(get_total_cells(GRID_4X4) == 16, 1);
    }

    #[test]
    fun test_check_input() {
        let sequence = vector[0, 1, 2, 3];
        let correct = vector[0, 1, 2, 3];
        let wrong = vector[0, 1, 2, 4];
        let short = vector[0, 1, 2];
        
        assert!(check_input(&sequence, &correct) == true, 0);
        assert!(check_input(&sequence, &wrong) == false, 1);
        assert!(check_input(&sequence, &short) == false, 2);
    }
}
