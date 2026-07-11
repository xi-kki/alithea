/// Alithea — Memory Training Arena
/// "Will you remember?"
/// 
/// Core game logic for Classic Pairs (card matching)
module alithea::game {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use sui::random::{Self, Random};
    use std::vector;

    // ============ CONSTANTS ============
    
    /// Game status
    const STATUS_WAITING: u8 = 0;
    const STATUS_PLAYING: u8 = 1;
    const STATUS_COMPLETED: u8 = 2;

    /// Grid sizes
    const GRID_4X4: u8 = 0;   // 8 pairs (16 cards)
    const GRID_4X6: u8 = 1;   // 12 pairs (24 cards)
    const GRID_6X6: u8 = 2;   // 18 pairs (36 cards)

    /// Scoring
    const BASE_SCORE: u64 = 1000;
    const MOVE_PENALTY: u64 = 10;
    const MATCH_BONUS: u64 = 50;
    const COMBO_MULTIPLIER: u64 = 150;  // 1.5x per combo
    const SPEED_BONUS_THRESHOLD: u64 = 30000;  // 30 seconds in ms
    const SPEED_BONUS_AMOUNT: u64 = 500;

    // ============ STRUCTS ============

    /// A card on the board
    public struct Card has store {
        card_type: u8,      // 0-17 (max 18 pairs)
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

    /// Player profile (for future use)
    public struct PlayerProfile has key, store {
        id: UID,
        address: address,
        games_played: u64,
        games_won: u64,
        best_score: u64,
        total_score: u64,
    }

    // ============ EVENTS ============

    public struct BoardCreated has copy, drop {
        board_id: ID,
        player: address,
        grid_size: u8,
        total_pairs: u64,
    }

    public struct CardRevealed has copy, drop {
        board_id: ID,
        card_index: u8,
        card_type: u8,
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
        r: &Random,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        let total_pairs = get_total_pairs(grid_size);
        let total_cards = total_pairs * 2;
        
        // Create cards vector
        let cards = vector::empty<Card>();
        let i = 0;
        while (i < total_pairs) {
            // Create two cards of each type
            vector::push_back(&mut cards, Card {
                card_type: i as u8,
                is_revealed: false,
                is_matched: false,
            });
            vector::push_back(&mut cards, Card {
                card_type: i as u8,
                is_revealed: false,
                is_matched: false,
            });
            i = i + 1;
        };

        // Shuffle cards using Sui's randomness
        shuffle_cards(&mut cards, r, ctx);

        // Create board
        let board = Board {
            id: object::new(ctx),
            player,
            grid_size,
            cards,
            first_card_index: option::none(),
            move_count: 0,
            match_count: 0,
            total_pairs: total_pairs as u64,
            combo: 0,
            start_time: clock::timestamp_ms(clock),
            end_time: option::none(),
            status: STATUS_PLAYING,
            score: 0,
        };

        // Emit event
        event::emit(BoardCreated {
            board_id: object::id(&board),
            player,
            grid_size,
            total_pairs: total_pairs as u64,
        });

        // Transfer to player
        transfer::public_transfer(board, player);
    }

    /// Reveal a card at the given index
    public entry fun reveal_card(
        board: &mut Board,
        card_index: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validate game is in progress
        assert!(board.status == STATUS_PLAYING, 0);
        
        // Validate player
        assert!(tx_context::sender(ctx) == board.player, 1);
        
        // Validate card index
        let total_cards = vector::length(&board.cards);
        assert!((card_index as u64) < total_cards, 2);
        
        // Get card
        let card = vector::borrow(&board.cards, card_index as u64);
        
        // Card must not be already revealed or matched
        assert!(!card.is_revealed && !card.is_matched, 3);

        // If this is the first card reveal
        if (option::is_none(&board.first_card_index)) {
            // Set first card
            board.first_card_index = option::some(card_index);
            
            // Reveal the card
            let card_mut = vector::borrow_mut(&mut board.cards, card_index as u64);
            card_mut.is_revealed = true;

            // Emit event
            event::emit(CardRevealed {
                board_id: object::id(board),
                card_index,
                card_type: card.card_type,
            });
        } else {
            // This is the second card
            let first_index = *option::borrow(&board.first_card_index);
            let first_card = vector::borrow(&board.cards, first_index as u64);
            
            // Can't pick the same card
            assert!(first_index != card_index, 4);

            // Reveal second card
            let card_mut = vector::borrow_mut(&mut board.cards, card_index as u64);
            card_mut.is_revealed = true;

            // Emit event
            event::emit(CardRevealed {
                board_id: object::id(board),
                card_index,
                card_type: card.card_type,
            });

            // Increment move count
            board.move_count = board.move_count + 1;

            // Check for match
            if (first_card.card_type == card.card_type) {
                // Match found!
                let card_mut = vector::borrow_mut(&mut board.cards, card_index as u64);
                card_mut.is_matched = true;
                let first_card_mut = vector::borrow_mut(&mut board.cards, first_index as u64);
                first_card_mut.is_matched = true;
                
                // Update combo
                board.combo = board.combo + 1;
                
                // Update match count
                board.match_count = board.match_count + 1;

                // Emit match event
                event::emit(MatchFound {
                    board_id: object::id(board),
                    card_type: first_card.card_type,
                    combo: board.combo,
                });

                // Check if game is complete
                if (board.match_count == board.total_pairs) {
                    complete_game(board, clock);
                };
            } else {
                // No match - reset combo and hide cards
                board.combo = 0;
                
                // Hide both cards (in a real game, this would happen after a delay)
                let first_card_mut = vector::borrow_mut(&mut board.cards, first_index as u64);
                first_card_mut.is_revealed = false;
                let card_mut = vector::borrow_mut(&mut board.cards, card_index as u64);
                card_mut.is_revealed = false;
            };

            // Reset first card index
            board.first_card_index = option::none();
        };
    }

    /// Get board state (for frontend)
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

    /// Get total pairs for grid size
    fun get_total_pairs(grid_size: u8): u64 {
        if (grid_size == GRID_4X4) {
            8
        } else if (grid_size == GRID_4X6) {
            12
        } else if (grid_size == GRID_6X6) {
            18
        } else {
            8  // Default to 4x4
        }
    }

    /// Shuffle cards using Fisher-Yates algorithm
    fun shuffle_cards(cards: &mut vector<Card>, r: &Random, ctx: &mut TxContext) {
        let n = vector::length(cards);
        let mut i = n - 1;
        while (i > 0) {
            // Generate random index
            let rand_u64 = random::u64(r, ctx);
            let j = rand_u64 % (i + 1);
            
            // Swap cards[i] and cards[j]
            let temp = vector::swap(cards, i, j);
            let _ = temp; // suppress unused variable warning
            
            if (i == 0) break;
            i = i - 1;
        };
    }

    /// Complete the game and calculate score
    fun complete_game(board: &mut Board, clock: &Clock) {
        board.status = STATUS_COMPLETED;
        board.end_time = option::some(clock::timestamp_ms(clock));
        
        // Calculate score
        let time_ms = *option::borrow(&board.end_time) - board.start_time;
        let mut score = BASE_SCORE;
        
        // Penalty for moves
        let min_moves = board.total_pairs;
        let extra_moves = board.move_count - min_moves;
        score = score - (extra_moves * MOVE_PENALTY);
        
        // Speed bonus
        if (time_ms < SPEED_BONUS_THRESHOLD) {
            score = score + SPEED_BONUS_AMOUNT;
        };
        
        // Ensure score doesn't go below 0
        if (score < 0) {
            score = 0;
        };
        
        board.score = score;

        // Emit completion event
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
