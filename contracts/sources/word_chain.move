/// Alithea — Word Chain (Verbal Memory)
/// Remember the words, type them back!
module alithea::word_chain {
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

    const BASE_SCORE: u64 = 50;
    const ROUND_BONUS: u64 = 50;
    const WORD_BONUS: u64 = 15;

    // ============ STRUCTS ============

    /// Word Chain game session
    public struct WordGame has key, store {
        id: UID,
        player: address,
        difficulty: u8,
        word_count: u64,
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

    /// Create a new Word Chain game
    public entry fun create_game(
        difficulty: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        let word_count = get_start_word_count(difficulty);

        let game = WordGame {
            id: object::new(ctx),
            player,
            difficulty,
            word_count,
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
        game: &mut WordGame,
        words_correct: bool,
        words_entered: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(game.status == STATUS_PLAYING, 0);
        assert!(tx_context::sender(ctx) == game.player, 1);

        if (words_correct) {
            let round_score = ROUND_BONUS + game.word_count * WORD_BONUS;
            game.score = game.score + round_score;

            event::emit(RoundCompleted {
                game_id: object::id(game),
                round: game.current_round,
                score: game.score,
            });

            game.current_round = game.current_round + 1;

            // Add more words
            game.word_count = game.word_count + 1;

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

    /// Get game state
    public fun get_state(game: &WordGame): (u8, u64, u64, u64, u64, u8) {
        (
            game.difficulty,
            game.current_round,
            game.word_count,
            20, // max rounds
            game.score,
            game.status,
        )
    }

    /// Get word count for current round
    public fun get_word_count(game: &WordGame): u64 {
        game.word_count
    }

    // ============ INTERNAL FUNCTIONS ============

    fun get_start_word_count(difficulty: u8): u64 {
        if (difficulty == DIFFICULTY_EASY) {
            3
        } else if (difficulty == DIFFICULTY_MEDIUM) {
            4
        } else {
            5
        }
    }

    fun emit_game_over(game: &WordGame) {
        event::emit(GameOver {
            game_id: object::id(game),
            player: game.player,
            rounds_survived: game.current_round - 1,
            final_score: game.score,
        });
    }

    // ============ TESTS ============

    #[test]
    fun test_get_start_word_count() {
        assert!(get_start_word_count(0) == 3, 0);
        assert!(get_start_word_count(1) == 4, 1);
        assert!(get_start_word_count(2) == 5, 2);
    }
}
