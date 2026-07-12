/// Alithea — Color Cascade (Color Sequence Memory)
/// Watch the colors, repeat the pattern!
module alithea::color_cascade {
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

    const DIFFICULTY_EASY: u8 = 0;
    const DIFFICULTY_MEDIUM: u8 = 1;
    const DIFFICULTY_HARD: u8 = 2;

    const BASE_SCORE: u64 = 100;
    const ROUND_BONUS: u64 = 50;
    const SPEED_BONUS: u64 = 25;

    // ============ STRUCTS ============

    /// Color Cascade game session
    public struct ColorGame has key, store {
        id: UID,
        player: address,
        difficulty: u8,
        color_count: u8,
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
        difficulty: u8,
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

    /// Create a new Color Cascade game
    public entry fun create_game(
        difficulty: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        let color_count = get_color_count(difficulty);

        // Generate initial sequence (3 items)
        let sequence = generate_initial_sequence(color_count, ctx);

        let game = ColorGame {
            id: object::new(ctx),
            player,
            difficulty,
            color_count,
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
            difficulty,
        });

        transfer::public_transfer(game, player);
    }

    /// Submit player's attempt for current round
    public entry fun submit_attempt(
        game: &mut ColorGame,
        player_input: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(game.status == STATUS_PLAYING, 0);
        assert!(tx_context::sender(ctx) == game.player, 1);

        let is_correct = check_input(&game.sequence, &player_input);

        if (is_correct) {
            game.score = game.score + ROUND_BONUS + calculate_speed_bonus(game, clock);

            event::emit(RoundCompleted {
                game_id: object::id(game),
                round: game.current_round,
                score: game.score,
            });

            game.current_round = game.current_round + 1;

            // Add new color to sequence
            let new_color = generate_random_color(game.color_count, ctx);
            vector::push_back(&mut game.sequence, new_color);

            // Increase speed
            if (game.speed_ms > 200) {
                game.speed_ms = game.speed_ms - 50;
            };

            if (game.current_round > game.max_rounds) {
                game.status = STATUS_COMPLETED;
                emit_game_over(game);
            };
        } else {
            game.status = STATUS_FAILED;
            emit_game_over(game);
        };
    }

    /// Get current sequence
    public fun get_sequence(game: &ColorGame): &vector<u8> {
        &game.sequence
    }

    /// Get game state
    public fun get_state(game: &ColorGame): (u8, u64, u64, u64, u64, u8) {
        (
            game.difficulty,
            game.current_round,
            game.max_rounds,
            game.speed_ms,
            game.score,
            game.status,
        )
    }

    // ============ INTERNAL FUNCTIONS ============

    fun get_color_count(difficulty: u8): u8 {
        if (difficulty == DIFFICULTY_EASY) {
            4
        } else if (difficulty == DIFFICULTY_MEDIUM) {
            5
        } else {
            6
        }
    }

    fun generate_initial_sequence(color_count: u8, ctx: &mut TxContext): vector<u8> {
        let mut sequence = vector[];
        let mut i = 0;
        while (i < 3) {
            let color = generate_random_color(color_count, ctx);
            vector::push_back(&mut sequence, color);
            i = i + 1;
        };
        sequence
    }

    fun generate_random_color(max: u8, ctx: &mut TxContext): u8 {
        let tx_hash = tx_context::digest(ctx);
        let seed = (*vector::borrow(tx_hash, 0) as u64) + (*vector::borrow(tx_hash, 1) as u64) * 256;
        let epoch = sui::tx_context::epoch(ctx);
        let max_u64 = max as u64;
        ((seed + epoch * 31) % max_u64) as u8
    }

    fun check_input(sequence: &vector<u8>, input: &vector<u8>): bool {
        let seq_len = vector::length(sequence);
        let input_len = vector::length(input);

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

    fun calculate_speed_bonus(game: &ColorGame, _clock: &Clock): u64 {
        if (game.speed_ms < 500) {
            SPEED_BONUS
        } else {
            0
        }
    }

    fun emit_game_over(game: &ColorGame) {
        event::emit(GameOver {
            game_id: object::id(game),
            player: game.player,
            rounds_survived: game.current_round - 1,
            final_score: game.score,
        });
    }

    // ============ TESTS ============

    #[test]
    fun test_get_color_count() {
        assert!(get_color_count(0) == 4, 0);
        assert!(get_color_count(1) == 5, 1);
        assert!(get_color_count(2) == 6, 2);
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
