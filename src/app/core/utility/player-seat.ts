import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  BroadcastService,
  GlobalConstant,
  InjectorInstance,
  PlatformDetection,
  TickerTimerService,
  WindowCommService,
  WindowManagerConstant
} from 'projects/shared/src/public-api';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';

export class PlayerSeat {
  seatId: number;

  newSeatId: number;

  actionTakenInThisRound: boolean;

  allIn: boolean;

  avatar: string;

  away: boolean;

  bet: number;

  chips: number;

  chipsLeft: number;

  folded: boolean;

  isSitout: boolean;

  isAddOn: boolean; // is player seat part or not?

  isAddOnAllowed: boolean; // is player seat part or not?

  isMucked: boolean;

  isOfferedAddon: boolean; // is player seat part or not?

  isOfferedRebuy: boolean; // is player seat part or not?

  isRebuy: boolean; // is player seat part or not?

  isRebuyAllowed: boolean; // is player seat part or not?

  lostAllin: boolean;

  lostAllinPlayerId: number;

  occupied: boolean;

  playerId: number;

  playerName: string;

  playing: number;

  reserved: boolean;

  ownSeat: boolean;

  avataarClass: string;

  capsuleStatus: string;

  toolTipPlayerchips: number;

  noteIconShow: boolean;

  notesColor: number;

  holeCard: Map<string, { suit: string; face: string; isWinnerCard: boolean }> = new Map();

  showUserChips: boolean;

  bountyOnHead: string;

  isRecognizePlayer: boolean;

  turnTimerValue: number;

  hideTurnTimer: boolean;

  isShowUserAction: boolean;

  playerAction: string;

  isCardDiscarded: boolean;

  chatBalloonData = {
    msg: '',
    isShow: false,
    isFocus: false,
    ballonsTimeoutTime: 0,
    animTimeout: null
  };

  isShowCards: boolean;

  userPotState = '-1';

  private roomName: string;

  private tickerTimerServiceRef: TickerTimerService;

  private avataarMappingService: AvataarMappingService;

  private windowCommService: WindowCommService;

  private userPreferencesService: UserPreferencesService;

  private broadcastService: BroadcastService;

  private gameService: GameService;

  private userNotesServiceRef: UserNotesService;

  private playerActionTimeRef$: Subscription;

  protected platformDetection = PlatformDetection.getInstance();

  private isDesktop = this.platformDetection.isDesktop;

  constructor(seatId: number, public cdr: ChangeDetectorRef, roomName: string) {
    this.seatId = seatId;
    this.newSeatId = seatId;
    this.roomName = roomName;
    this.tickerTimerServiceRef = InjectorInstance.get(TickerTimerService);
    this.avataarMappingService = InjectorInstance.get(AvataarMappingService);
    this.userPreferencesService = InjectorInstance.get(UserPreferencesService);
    this.userNotesServiceRef = InjectorInstance.get(UserNotesService);
    this.gameService = InjectorInstance.get(GameService);
    this.windowCommService = InjectorInstance.get(WindowCommService);
    this.broadcastService = InjectorInstance.get(BroadcastService);
  }

  // set capsule status
  setCapsuleStatus(status?: string) {
    if (!status) {
      let capsuleStatus = '';
      if (this.capsuleStatus !== undefined && this.capsuleStatus !== null) {
        capsuleStatus = this.capsuleStatus.toLowerCase();
      }
      if (capsuleStatus !== 'dontshowsithere' && capsuleStatus !== 'seatoccupied') {
        this.capsuleStatus = 'dontshowsithere';
      }
    } else {
      this.capsuleStatus = status;
    }
  }

  // get capsule status
  getCapsuleStatus() {
    return this.capsuleStatus;
  }

  // set player name
  setPlayerName(name: string) {
    this.playerName = name;
  }

  // get player name
  getPlayerName() {
    return this.playerName;
  }

  // set tool tip player chips
  setToolTipPlayerchips(chips: number) {
    this.toolTipPlayerchips = chips;
  }

  // get tool tip player chips
  getToolTipPlayerchips() {
    return this.toolTipPlayerchips;
  }

  setPlayerChips(chips: number) {
    this.chipsLeft = chips;
  }

  getPlayerChips() {
    return this.chipsLeft;
  }

  setAvataarClass(avatar: string) {
    this.avatar = avatar;
    if (this.avatar !== '') {
      let avataarClass = this.avataarMappingService.getAvataar(this.avatar, this.seatId);
      if (this.ownSeat) {
        avataarClass = this.avataarMappingService.getAvataar(this.avatar, this.seatId);
      }
      this.avataarClass = avataarClass;
    } else {
      this.avataarClass = '';
    }
  }

  getAvataarClass() {
    return this.avataarClass;
  }

  setNoteIconShow(isShow: boolean): void {
    this.noteIconShow = isShow;
  }

  getNoteIconShow(): boolean {
    return this.noteIconShow;
  }

  getNoteColor(): number {
    return this.notesColor;
  }

  setNoteColor(color: number): void {
    this.notesColor = color;
    this.setNoteIconShow(true);
  }

  removeUserNotes(): void {
    this.notesColor = -1;
    this.setNoteIconShow(false);
  }

  setHoleCard(holecards: any) {
    if (holecards.length > 0) {
      this.holeCard.clear();
      holecards.forEach((card: any) => {
        let suit: any = '';
        if (card) {
          suit = this.gameService.cardMap('suit', card.suit.value);
          const face = this.gameService.cardMap('face', card.face.value);

          this.holeCard.set(`${suit}${face}`, {
            suit,
            face,
            isWinnerCard: false
          });
        } else if (card === null) {
          // in case of tease
          suit = 'empty0';
          this.holeCard.set(`${suit}`, {
            suit,
            face: '',
            isWinnerCard: false
          });
        }
      });
    } else {
      this.holeCard.clear();
    }
    if (this.ownSeat) {
      if (this.isDesktop) {
        this.windowCommService.sendDataToWindow({
          cmd: 'openTableHoleCardsForAllWindow',
          data: {
            roomName: this.roomName,
            holeCards: Array.from(this.getHoleCard().values())
          },
          windowType: [
            WindowManagerConstant.WINDOW_TYPE.GAMETABLE,
            WindowManagerConstant.WINDOW_TYPE.LOBBY
          ]
        });
      } else {
        const obj = {
          roomName: this.roomName,
          holeCards: Array.from(this.getHoleCard().values())
        };
        this.broadcastService.$broadcast('openTableHoleCardsForAllWindow', obj);
      }
    }
  }

  getHoleCard() {
    return this.holeCard;
  }

  setShowUserChips(isShow: boolean) {
    this.showUserChips = isShow;
  }

  getShowUserChips() {
    return this.showUserChips;
  }

  setSittingOutStatus(status: boolean) {
    this.isSitout = status;
  }

  getSittingOutStatus() {
    return this.isSitout;
  }

  setFoldedCard(isFold: boolean) {
    this.folded = isFold;
  }

  getFoldedCard() {
    return this.folded;
  }

  setIsShowCards(isShow: boolean) {
    this.isShowCards = isShow;
  }

  getIsShowCards() {
    return this.isShowCards;
  }

  setBountyOnHead(bountyOnHead: any) {
    this.bountyOnHead = bountyOnHead;
  }

  getBountyOnHead() {
    return this.bountyOnHead;
  }

  setHideTurnTimer(isHide: boolean) {
    this.hideTurnTimer = isHide;
  }

  getHideTurnTimer() {
    return this.hideTurnTimer;
  }

  setTurnTimerValue(turnTime: number) {
    this.turnTimerValue = turnTime;
  }

  getTurnTimerValue() {
    return this.turnTimerValue;
  }

  setIsRecognizePlayer(isRecognize: boolean) {
    this.isRecognizePlayer = isRecognize;
  }

  getIsRecognizePlayer() {
    return this.isRecognizePlayer;
  }

  setBetAmount(amt: number) {
    this.bet = amt;
  }

  getBetAmount() {
    return this.bet;
  }

  setPlayerAction(actionName: string) {
    if (this.playerActionTimeRef$) {
      this.playerActionTimeRef$.unsubscribe();
    }
    this.playerAction = actionName;
    this.isShowUserAction = true;
    let playerActionTime = GlobalConstant.capsuleActionTimeoutDelay;
    this.playerActionTimeRef$ = this.tickerTimerServiceRef.tickerMessage
      .pipe(
        filter((time: { tickTime: number }) => {
          playerActionTime -= time.tickTime;
          if (playerActionTime <= 0) {
            return true;
          }
          return false;
        })
      )
      .subscribe(() => {
        this.playerAction = '';
        this.isShowUserAction = false;
        this.playerActionTimeRef$.unsubscribe();
        this.cdr.detectChanges();
      });
  }

  getPlayerAction() {
    return this.playerAction;
  }

  setPlayingStatus(playing: number) {
    this.playing = playing;
  }

  getPlayingStatus() {
    return this.playing;
  }

  showChatBalloon(msg: string) {
    this.chatBalloonData.msg = msg;
    this.chatBalloonData.isShow = true;
  }

  removeChatBalloon() {
    this.chatBalloonData.msg = '';
    this.chatBalloonData.isShow = false;
  }

  setIsAway(isAway: boolean) {
    this.away = isAway;
  }

  getIsAway() {
    return this.away;
  }

  setIsAllIn(isAllin: boolean) {
    this.allIn = isAllin;
  }

  getIsAllIn() {
    return this.allIn;
  }

  setActionTakenInThisRound(isActionTaken: boolean) {
    this.actionTakenInThisRound = isActionTaken;
  }

  getActionTakenInThisRound() {
    return this.actionTakenInThisRound;
  }

  setIsMucked(isMuck: boolean) {
    this.isMucked = isMuck;
  }

  getIsMucked() {
    return this.isMucked;
  }

  setLostAllin(isLostAllin: boolean) {
    this.lostAllin = isLostAllin;
  }

  getLostAllin() {
    return this.lostAllin;
  }

  setLostAllinPlayerId(playerId: number) {
    this.lostAllinPlayerId = playerId;
  }

  getLostAllinPlayerId() {
    return this.lostAllinPlayerId;
  }

  setOccupied(isOccupied: boolean) {
    this.occupied = isOccupied;
  }

  getOccupied() {
    return this.occupied;
  }

  setPlayerId(playerId: number) {
    this.playerId = playerId;
  }

  getPlayerId() {
    return this.playerId;
  }

  setReserved(isReserved: boolean) {
    this.reserved = isReserved;
  }

  getReserved() {
    return this.reserved;
  }

  setIsCardDiscarded(isDiscarded: boolean) {
    this.isCardDiscarded = isDiscarded;
  }

  getIsCardDiscarded() {
    return this.isCardDiscarded;
  }

  setUserPotState(state: string) {
    this.userPotState = state;
  }

  getUserPotState() {
    return this.userPotState;
  }

  // get player notes on take seat for update player seat title
  getUserNotesOnTakeSeat() {
    if (this.occupied) {
      if (this.playerName !== '' && this.userNotesServiceRef.hasUserNotes(this.playerId)) {
        const playerNote = this.userNotesServiceRef.getUserNotes(this.playerId);
        // only one time fetch player notes
        if (playerNote.note === undefined && playerNote.color !== -1) {
          // request for user note who's player take seat
          this.userNotesServiceRef
            .getUserNotesFromServer(this.playerId, this.playerName, this.roomName)
            .subscribe(() => {
              // do nothing
            });
        }
      }
    }
  }
}
