/// Alithea — Rhythm Recall (Auditory Memory)
/// Listen to the beat, repeat it back!
module alithea::rhythm_recall {
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
    const BEAT_BONUS: u64 = 10;

    // ============ STRUCTS ============

    /// Rhythm Recall game session
    public struct RhythmGame has key, store {
        id: UID,
        player: address,
        difficulty: u8,
        pad_count: u8,
        sequence: vector<u8>,
        current_round: u64,
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

    /// Create a new Rhythm Recall game
    public entry fun create_game(
        difficulty: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        let pad_count = get_pad_count(difficulty);

        // Generate initial sequence (3 beats)
        let sequence = generate_initial_sequence(pad_count, ctx);

        let game = RhythmGame {
            id: object::new(ctx),
            player,
            difficulty,
            pad_count,
            sequence,
            current_round: 1,
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
        game: &mut RhythmGame,
        player_input: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(game.status == STATUS_PLAYING, 0);
        assert!(tx_context::sender(ctx) == game.player, 1);

        let is_correct = check_input(&game.sequence, &player_input);

        if (is_correct) {
            let seq_len = vector::length(&game.sequence) as u64;
            let round_score = ROUND_BONUS + seq_len * BEAT_BONUS;
            game.score = game.score + round_score;

            event::emit(RoundCompleted {
                game_id: object::id(game),
                round: game.current_round,
                score: game.score,
            });

            game.current_round = game.current_round + 1;

            // Add new beat to sequence
            let new_beat = generate_random_beat(game.pad_count, ctx);
            vector::push_back(&mut game.sequence, new_beat);

            // Check max rounds
            if (game.current_round > 20) {
                game.status = STATUS_COMPLETED;
                emit_game_over(game);
            };
        } else {
            game.status = STATUS_FAILED;
            emit_game_over(game);
        };
    }

    /// Get current sequence
    public fun get_sequence(game: &RhythmGame): &vector<u8> {
        &game.sequence
    }

    /// Get game state
    public fun get_state(game: &RhythmGame): (u8, u64, u64, u64, u8) {
        (
            game.difficulty,
            game.current_round,
            vector::length(&game.sequence),
            game.score,
            game.status,
        )
    }

    // ============ INTERNAL FUNCTIONS ============

    fun get_pad_count(difficulty: u8): u8 {
        if (difficulty == DIFFICULTY_EASY) {
            4
        } else if (difficulty == DIFFICULTY_MEDIUM) {
            6
        } else {
            8
        }
    }

    fun generate_initial_sequence(pad_count: u8, ctx: &mut TxContext): vector<u8> {
        let mut sequence = vector[];
        let mut i = 0;
        while (i < 3) {
            let beat = generate_random_beat(pad_count, ctx);
            vector::push_back(&mut sequence, beat);
            i = i + 1;
        };
        sequence
    }

    fun generate_random_beat(max: u8, ctx: &mut TxContext): u8 {
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

    fun emit_game_over(game: &RhythmGame) {
        event::emit(GameOver {
            game_id: object::id(game),
            player: game.player,
            rounds_survived: game.current_round - 1,
            final_score: game.score,
        });
    }

    // ============ TESTS ============

    #[test]
    fun test_get_pad_count() {
        assert!(get_pad_count(0) == 4, 0);
        assert!(get_pad_count(1) == 6, 1);
        assert!(get_pad_count(2) == 8, 2);
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
