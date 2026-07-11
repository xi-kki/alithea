/// Alithea — Number Vault (Digit Recall)
/// Remember the numbers, type them back!
module alithea::number_vault {
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

    const MODE_FORWARD: u8 = 0;
    const MODE_REVERSE: u8 = 1;
    const MODE_ASCENDING: u8 = 2;

    const BASE_SCORE: u64 = 50;
    const ROUND_BONUS: u64 = 25;
    const SPEED_BONUS: u64 = 50;
    const LENGTH_MULTIPLIER: u64 = 10;

    // ============ STRUCTS ============

    /// Number Vault game session
    public struct NumberGame has key, store {
        id: UID,
        player: address,
        digits: vector<u8>,
        current_round: u64,
        recall_mode: u8,
        display_time_ms: u64,
        score: u64,
        status: u8,
        start_time: u64,
    }

    // ============ EVENTS ============

    public struct GameCreated has copy, drop {
        game_id: ID,
        player: address,
        recall_mode: u8,
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

    /// Create a new Number Vault game
    public entry fun create_game(
        recall_mode: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        
        // Generate initial digits (4 digits)
        let digits = generate_digits(4, ctx);

        let game = NumberGame {
            id: object::new(ctx),
            player,
            digits,
            current_round: 1,
            recall_mode,
            display_time_ms: 3000,
            score: 0,
            status: STATUS_PLAYING,
            start_time: clock::timestamp_ms(clock),
        };

        event::emit(GameCreated {
            game_id: object::id(&game),
            player,
            recall_mode,
        });

        transfer::public_transfer(game, player);
    }

    /// Submit player's attempt for current round
    public entry fun submit_attempt(
        game: &mut NumberGame,
        player_input: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(game.status == STATUS_PLAYING, 0);
        assert!(tx_context::sender(ctx) == game.player, 1);

        // Get expected input based on mode
        let expected = get_expected_input(game);

        // Check if input matches
        let is_correct = check_input(&expected, &player_input);

        if (is_correct) {
            // Round passed!
            let digit_len = vector::length(&game.digits) as u64;
            let round_score = ROUND_BONUS + digit_len * LENGTH_MULTIPLIER;
            game.score = game.score + round_score + calculate_speed_bonus(game, clock);
            
            event::emit(RoundCompleted {
                game_id: object::id(game),
                round: game.current_round,
                score: game.score,
            });

            // Advance to next round
            game.current_round = game.current_round + 1;
            
            // Add more digits
            let new_digits = generate_digits(1, ctx);
            let mut i = 0;
            while (i < vector::length(&new_digits)) {
                vector::push_back(&mut game.digits, *vector::borrow(&new_digits, i));
                i = i + 1;
            };
            
            // Reduce display time (harder)
            if (game.display_time_ms > 1000) {
                game.display_time_ms = game.display_time_ms - 200;
            };

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

    /// Get current digits (for display)
    public fun get_digits(game: &NumberGame): &vector<u8> {
        &game.digits
    }

    /// Get game state
    public fun get_state(game: &NumberGame): (u64, u8, u64, u64, u8) {
        (
            game.current_round,
            game.recall_mode,
            game.display_time_ms,
            game.score,
            game.status,
        )
    }

    /// Get digit count
    public fun get_digit_count(game: &NumberGame): u64 {
        vector::length(&game.digits)
    }

    // ============ INTERNAL FUNCTIONS ============

    fun generate_digits(count: u64, ctx: &mut TxContext): vector<u8> {
        let mut digits = vector[];
        let tx_hash = tx_context::digest(ctx);
        let seed = (*vector::borrow(tx_hash, 0) as u64);
        
        let mut i = 0;
        while (i < count) {
            let digit = ((seed + i * 7919) % 10) as u8;
            vector::push_back(&mut digits, digit);
            i = i + 1;
        };
        digits
    }

    fun get_expected_input(game: &NumberGame): vector<u8> {
        if (game.recall_mode == MODE_FORWARD) {
            game.digits
        } else if (game.recall_mode == MODE_REVERSE) {
            reverse_vector(&game.digits)
        } else {
            // Ascending
            sort_vector(&game.digits)
        }
    }

    fun reverse_vector(v: &vector<u8>): vector<u8> {
        let len = vector::length(v);
        let mut result = vector[];
        let mut i = len;
        while (i > 0) {
            i = i - 1;
            vector::push_back(&mut result, *vector::borrow(v, i));
        };
        result
    }

    fun sort_vector(v: &vector<u8>): vector<u8> {
        let len = vector::length(v);
        let mut result = vector[];
        let mut i = 0;
        while (i < len) {
            vector::push_back(&mut result, *vector::borrow(v, i));
            i = i + 1;
        };
        // Simple bubble sort
        let mut i = 0;
        while (i < len) {
            let mut j = 0;
            while (j < len - 1 - i) {
                let a = *vector::borrow(&result, j);
                let b = *vector::borrow(&result, j + 1);
                if (a > b) {
                    let temp = *vector::borrow(&result, j);
                    *vector::borrow_mut(&mut result, j) = *vector::borrow(&result, j + 1);
                    *vector::borrow_mut(&mut result, j + 1) = temp;
                };
                j = j + 1;
            };
            i = i + 1;
        };
        result
    }

    fun check_input(expected: &vector<u8>, input: &vector<u8>): bool {
        let exp_len = vector::length(expected);
        let input_len = vector::length(input);
        
        if (exp_len != input_len) {
            return false
        };

        let mut i = 0;
        while (i < exp_len) {
            let exp_val = *vector::borrow(expected, i);
            let input_val = *vector::borrow(input, i);
            if (exp_val != input_val) {
                return false
            };
            i = i + 1;
        };
        
        true
    }

    fun calculate_speed_bonus(game: &NumberGame, clock: &Clock): u64 {
        let _elapsed = clock::timestamp_ms(clock) - game.start_time;
        if (game.display_time_ms < 2000) {
            SPEED_BONUS
        } else {
            0
        }
    }

    fun emit_game_over(game: &NumberGame) {
        event::emit(GameOver {
            game_id: object::id(game),
            player: game.player,
            rounds_survived: game.current_round - 1,
            final_score: game.score,
        });
    }

    // ============ TESTS ============

    #[test]
    fun test_reverse_vector() {
        let v = vector[1, 2, 3, 4, 5];
        let reversed = reverse_vector(&v);
        assert!(reversed == vector[5, 4, 3, 2, 1], 0);
    }

    #[test]
    fun test_check_input() {
        let expected = vector[1, 2, 3];
        let correct = vector[1, 2, 3];
        let wrong = vector[1, 2, 4];
        
        assert!(check_input(&expected, &correct) == true, 0);
        assert!(check_input(&expected, &wrong) == false, 1);
    }
}
