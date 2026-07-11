/// Alithea — Memory Training Arena
/// "Will you remember?"
/// 
/// Core game logic for Classic Pairs (card matching)
module alithea::game {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use sui::event;
    use std::vector;
    use std::option;

    // ============ CONSTANTS ============
    
    /// Game status
    const STATUS_PLAYING: u8 = 1;
    const STATUS_COMPLETED: u8 = 2;

    /// Grid sizes
    const GRID_4X4: u8 = 0;
    const GRID_4X6: u8 = 1;
    const GRID_6X6: u8 = 2;

    /// Scoring
    const BASE_SCORE: u64 = 1000;
    const MOVE_PENALTY: u64 = 10;
    const SPEED_BONUS_THRESHOLD: u64 = 30000;
    const SPEED_BONUS_AMOUNT: u64 = 500;

    // ============ STRUCTS ============

    /// A card on the board
    public struct Card has store, copy, drop {
        card_type: u8,
        is_revealed: bool,
        is_matched: bool,
    }

    /// The game board
    public struct Board has key, store {
        id: UID,
        player: address,
        grid_size: u8,
        cards: vector<Card>,
        first_card_index: option::Option<u8>,
        move_count: u64,
        match_count: u64,
        total_pairs: u64,
        combo: u64,
        start_time: u64,
        end_time: option::Option<u64>,
        status: u8,
        score: u64,
    }

    // ============ EVENTS ============

    public struct BoardCreated has copy, drop {
        board_id: ID,
        player: address,
        grid_size: u8,
        total_pairs: u64,
    }

    public struct MatchFound has copy, drop {
        board_id: ID,
        card_type: u8,
        combo: u64,
    }

    public struct GameCompleted has copy, drop {
        board_id: ID,
        player: address,
        score: u64,
        moves: u64,
        time_ms: u64,
    }

    // ============ ENTRY FUNCTIONS ============

    /// Create a new game board
    public entry fun create_board(
        grid_size: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        let total_pairs = get_total_pairs(grid_size);
        
        // Create cards vector
        let mut cards = vector[];
        let mut i = 0;
        while (i < total_pairs) {
            vector::push_back(&mut cards, Card {
                card_type: (i as u8),
                is_revealed: false,
                is_matched: false,
            });
            vector::push_back(&mut cards, Card {
                card_type: (i as u8),
                is_revealed: false,
                is_matched: false,
            });
            i = i + 1;
        };

        // Shuffle cards
        shuffle_cards(&mut cards, ctx);

        // Create board
        let board = Board {
            id: object::new(ctx),
            player,
            grid_size,
            cards,
            first_card_index: option::none(),
            move_count: 0,
            match_count: 0,
            total_pairs: (total_pairs as u64),
            combo: 0,
            start_time: clock::timestamp_ms(clock),
            end_time: option::none(),
            status: STATUS_PLAYING,
            score: 0,
        };

        event::emit(BoardCreated {
            board_id: object::id(&board),
            player,
            grid_size,
            total_pairs: (total_pairs as u64),
        });

        transfer::public_transfer(board, player);
    }

    /// Reveal a card at the given index
    public entry fun reveal_card(
        board: &mut Board,
        card_index: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(board.status == STATUS_PLAYING, 0);
        assert!(tx_context::sender(ctx) == board.player, 1);
        
        let total_cards = vector::length(&board.cards);
        assert!((card_index as u64) < total_cards, 2);
        
        // Get card info first
        let card = *vector::borrow(&board.cards, card_index as u64);
        assert!(!card.is_revealed && !card.is_matched, 3);

        if (option::is_none(&board.first_card_index)) {
            // First card reveal
            board.first_card_index = option::some(card_index);
            let card_mut = vector::borrow_mut(&mut board.cards, card_index as u64);
            card_mut.is_revealed = true;
        } else {
            // Second card reveal
            let first_index = *option::borrow(&board.first_card_index);
            assert!(first_index != card_index, 4);

            // Get first card type
            let first_card_ref = vector::borrow(&board.cards, first_index as u64);
            let first_card_type = first_card_ref.card_type;

            // Reveal second card
            let card_mut = vector::borrow_mut(&mut board.cards, card_index as u64);
            card_mut.is_revealed = true;

            board.move_count = board.move_count + 1;

            if (first_card_type == card.card_type) {
                // Match found
                let card_mut = vector::borrow_mut(&mut board.cards, card_index as u64);
                card_mut.is_matched = true;
                card_mut.is_revealed = false;
                let first_card_mut = vector::borrow_mut(&mut board.cards, first_index as u64);
                first_card_mut.is_matched = true;
                first_card_mut.is_revealed = false;
                
                board.combo = board.combo + 1;
                board.match_count = board.match_count + 1;

                event::emit(MatchFound {
                    board_id: object::id(board),
                    card_type: first_card_type,
                    combo: board.combo,
                });

                if (board.match_count == board.total_pairs) {
                    complete_game(board, clock);
                };
            } else {
                // No match - hide both cards
                board.combo = 0;
                let first_card_mut = vector::borrow_mut(&mut board.cards, first_index as u64);
                first_card_mut.is_revealed = false;
                let card_mut = vector::borrow_mut(&mut board.cards, card_index as u64);
                card_mut.is_revealed = false;
            };

            board.first_card_index = option::none();
        };
    }

    /// Get board state
    public fun get_board_state(board: &Board): (u8, u64, u64, u64, u64, u8, option::Option<u8>) {
        (
            board.grid_size,
            board.move_count,
            board.match_count,
            board.total_pairs,
            board.combo,
            board.status,
            board.first_card_index,
        )
    }

    /// Get card at index
    public fun get_card(board: &Board, index: u64): (u8, bool, bool) {
        let card = vector::borrow(&board.cards, index);
        (card.card_type, card.is_revealed, card.is_matched)
    }

    /// Get total number of cards
    public fun get_total_cards(board: &Board): u64 {
        vector::length(&board.cards)
    }

    /// Get score
    public fun get_score(board: &Board): u64 {
        board.score
    }

    /// Get game status
    public fun get_status(board: &Board): u8 {
        board.status
    }

    // ============ INTERNAL FUNCTIONS ============

    fun get_total_pairs(grid_size: u8): u64 {
        if (grid_size == GRID_4X4) {
            8
        } else if (grid_size == GRID_4X6) {
            12
        } else if (grid_size == GRID_6X6) {
            18
        } else {
            8
        }
    }

    fun shuffle_cards(cards: &mut vector<Card>, ctx: &mut TxContext) {
        let n = vector::length(cards);
        let tx_hash = tx_context::digest(ctx);
        let seed = (*vector::borrow(tx_hash, 0) as u64) + (*vector::borrow(tx_hash, 1) as u64) * 256;
        
        let mut i = n - 1;
        while (i > 0) {
            let j = (seed + i * 7919) % (i + 1);
            vector::swap(cards, i, j);
            if (i == 0) break;
            i = i - 1;
        };
    }

    fun complete_game(board: &mut Board, clock: &Clock) {
        board.status = STATUS_COMPLETED;
        board.end_time = option::some(clock::timestamp_ms(clock));
        
        let time_ms = *option::borrow(&board.end_time) - board.start_time;
        let mut score = BASE_SCORE;
        
        let min_moves = board.total_pairs;
        let extra_moves = board.move_count - min_moves;
        score = score - (extra_moves * MOVE_PENALTY);
        
        if (time_ms < SPEED_BONUS_THRESHOLD) {
            score = score + SPEED_BONUS_AMOUNT;
        };
        
        if (score < 0) {
            score = 0;
        };
        
        board.score = score;

        event::emit(GameCompleted {
            board_id: object::id(board),
            player: board.player,
            score: board.score,
            moves: board.move_count,
            time_ms,
        });
    }

    // ============ TESTS ============

    #[test]
    fun test_get_total_pairs() {
        assert!(get_total_pairs(GRID_4X4) == 8, 0);
        assert!(get_total_pairs(GRID_4X6) == 12, 1);
        assert!(get_total_pairs(GRID_6X6) == 18, 2);
    }
}
