// FIT2102 2018 Assignment 1
// https://docs.google.com/document/d/1woMAgJVf1oL3M49Q8N3E1ykTuTu5_r28_MQPVS5QIVo/edit?usp=sharing

/** 
 * The idea of breakout arcade game is incorporate in the game,
 * where there will be a brick randomly placed within svg,
 * bonus 1 score will be granted if player or computer hit the brick.
 * The brick will disappear upon being hitted,
 * and will rebuild whenever player or computer miss the ball
*/

// There are three main Observable used in implementing this Pong game

/**
 * The first Observable is to control player's paddle and to restrict it from exceeding the top and bottom boundary.
 * The general idea is to allow paddle follow mouse movement when mousedown and place it at the place when mouseup.
 * First we get mouse y-coordinate (clientY) when mousedown event take place on paddle.
 * Then clientY minus the y attribute of the paddle to get yOffset as the paddle is constructed based on y attribute of paddle.
 * These steps stop when mouseup event take place.
 * From the latest clientY, we can get the y attribute of the paddle by adding back the offset, hence we know the final position of the paddle.
 * Then, branches of filter function is used to set some conditions on y attribute of paddle to avoid paddle goes out of svg bound:
    i)  cannot less than 0 (ensure top of paddle not exceeding svg top boundary)
    ii) more than svg height - paddle height (ensure bottom of paddle not exceeding svg bottom boundary)
 */

/**
 * The second Observable is for the game to start when clicking on ball
 * When click event happens on the ball, it subscribe the whole function which exist in third Observable
 */

/**
 * The thrid Observable is to control the ball movement and computer's paddle movement
 * Observable is notified every 1 milliseconds and update all the movements after filter and subscribe 
        - as long as the highest score is less than or equals to 11 with takeWhile function (added in observable.ts)
        - while the condition not satisfied, it will unsubscribe the whole Observable
 * There are several branching of filter and subscribe functios to handle different events.
 * After each filter with conditions, subscribe to the actions that need to be taken:
    i)   game ending when either player or computer reaches 11 scores - player wins if player gains 11 scores first and vice versa
    ii)  ball movements when it hits on user's or computer's paddle or on top and bottom of svg - ball bounces to opposite directions with new random angle
    iii) computer paddle movements when ball is moving, such that:
          a) it will move up by 0.65 every 1 millisecond when cy attribute of the ball is lower than y attribute of paddle
          b) it will move down by 0.65 every 1 millisecond when cy attribute of the ball is higher than y attribute of paddle
          c) 0.65 is used because every 1 millisecond the ball will move around 0.7, hence 0.65 which is slightly lower than 0.7 provides chances for player to win
    iv)  update scores and rebuild brick when player or computer misses the ball 
          - player gains score if computer misses the ball and vice versa
    v)   update scores and remove brick when player or computer hit the brick 
          - player gains score if player hits the ball and vice versa
*/

/**
 * There are also minor Observable such as mouseup, mousedown, mousemove and click event
 * These Observables are used to notify the three main Observables to carry out the functions when these events happen
*/

/**
 * All the HTMLElement type constants and variables are created with the id from pong.html
 * All Elem type variables such as ball and paddles (player1, player2) are created from Elem class in svgelement.ts
*/

function pong<T>():void {
  // -------------------------------------------------- declare constants -------------------------------------------------------
  const svg: HTMLElement = document.getElementById("canvas")!,
  bounding: ClientRect = svg.getBoundingClientRect(),
  mousemove: Observable<MouseEvent> = Observable.fromEvent<MouseEvent>(svg, 'mousemove'),
  mouseup: Observable<MouseEvent> = Observable.fromEvent<MouseEvent>(svg, 'mouseup'),
  displayScore1: HTMLElement = document.getElementById("score1")!,
  displayScore2: HTMLElement = document.getElementById("score2")!,
  winMessage: HTMLElement = document.getElementById('winMessage')!

  // ------------------------------------------------ declaring variables ---------------------------------------------------------
  let 
  player1: Elem = new Elem(svg, 'rect').attr('x', 5).attr('y', 260).attr('width', 8).attr('height', 60).attr('fill', '#FF0000'),
  player2: Elem = new Elem(svg, 'rect').attr('x', 585).attr('y', 260).attr('width', 8).attr('height', 60).attr('fill', '#00FF00'),
  line: Elem = new Elem(svg, 'rect').attr('x', 299).attr('y', 0).attr('width', 2).attr('height', 600).attr('fill', '#999999'),
  ball: Elem = new Elem(svg, 'circle').attr('cx', 300).attr('cy', 300).attr('r', 6).attr('fill', '#FFFFFF'),
  score1: number = 0,
  score2: number = 0

  // ---------------------------------------- breakout brick element variables ---------------------------------------------------
  let
  brick1: Elem = new Elem(svg, 'rect').attr('x', Math.random()*200+200).attr('y', Math.random()*500+50).attr('height', 30).attr('width', 12).attr('fill', '#FF9900')
  
  // ---------------------------------------------- first Observable: player's paddle -------------------------------------------
  let p2: Observable<{y:number}> =
    Observable
    .fromEvent<MouseEvent>(player2.elem, 'mousedown')
    .map(({clientY}) => ({yOffset: Number(player2.attr('y')) - clientY}))
    .flatMap(({yOffset}) =>
      mousemove
        .takeUntil(mouseup)
        .map(({clientY}) => ({y:clientY + yOffset})))
  
    p2.filter(({y}) => y < 0)
      .subscribe(({y}) => {player2.attr('y', 0)})
  
    p2.filter(({y}) => y > bounding.height - Number(player2.attr('height')))
      .subscribe(({y}) => {player2.attr('y', bounding.height - Number(player2.attr('height')))})
  
    p2.filter(({y}) => y > 0)
      .filter(({y}) => y < bounding.height - Number(player2.attr('height')))
      .subscribe(({y}) => {player2.attr('y', y)})
  
  // --------------------------------------------- second Observable: game start ----------------------------------------------------------
  let 
  randX: number = Math.random() > 0.5 ? 1 : -1, 
  randY: number = Math.random() > 0.5 ? 1 : -1,
  newX: number = Math.abs(Math.cos((Math.random() * Math.PI/2) - Math.PI/4)),
  newY: number = Math.abs(Math.sin((Math.random() * Math.PI/2) - Math.PI/4))
  // This formula is referenced from:
  // Source: https://github.com/sufianrhazi/typescript-pong/blob/master/src/Ball.ts

  Observable.fromEvent<MouseEvent>(ball.elem, 'click')
            .subscribe(() => {
              //----------------- third Observable: ball and paddle movement ----------------------------
              let start = Observable.interval(1)
  
  // game over messages
  start.filter(() => score1 == 11 || score2 == 11)
        .subscribe(() => {
          score1 == 11 ? winMessage.innerHTML = "Computer wins!" :  winMessage.innerHTML = "Player wins!"
          document.getElementById('start')!.innerHTML = "Press F5 to restart"
          })

  // continue ball movement as long as score is below 11
  start.takeWhile(() => Math.max(score1, score2) < 11)
        .subscribe(() => {    
          ball.attr('cx', Number(ball.attr('cx')) + (randX > 0 ? newX : -newX)).attr('cy', Number(ball.attr('cy')) + (randY > 0 ? newY : -newY))
        })  

  // move computer's paddle up when ball is above computer's paddle
  start.filter(() => Number(ball.attr('cy')) + Number(ball.attr('r')) < Number(player1.attr('y')))
        .subscribe(() => player1.attr('y', Number(player1.attr('y')) - 0.65))

  // move computer's paddle down when ball is below computer's paddle
  start.filter(() => Number(player1.attr('y'))+ Number(player1.attr('height')) < Number(ball.attr('cy'))- Number(ball.attr('r')))
        .subscribe(() => player1.attr('y', Number(player1.attr('y')) + 0.65))

  // ball movement when hit on user's paddle
  start.filter(() => Number(ball.attr('cx')) + Number(ball.attr('r')) >= Number(player2.attr('x')))
        .filter(() =>Number(ball.attr('cx')) + Number(ball.attr('r')) <= Number(player2.attr('x'))+Number(player2.attr('width')))
        .filter(() => Number(ball.attr('cy')) + Number(ball.attr('r')) >= Number(player2.attr('y')))
        .filter(() => Number(ball.attr('cy')) - Number(ball.attr('r')) <= Number(player2.attr('y'))+Number(player2.attr('height')))
        .subscribe(() => {
          randX = -randX
          newX = Math.abs(Math.cos((Math.random() * Math.PI/2) - Math.PI/4)),
          newY = Math.abs(Math.sin((Math.random() * Math.PI/2) - Math.PI/4))
          ball.attr('cx', Number(ball.attr('cx')) + (randX > 0 ? newX : -newX)), ball.attr('cy', Number(ball.attr('cy')) + (randY > 0 ? newY : -newY)).attr('fill', '#00FF00')})
          
  // ball movement when hit on computer's paddle
  start.filter(() => Number(ball.attr('cx')) - Number(ball.attr('r')) > Number(player1.attr('x')))
          .filter(() =>Number(ball.attr('cx')) - Number(ball.attr('r')) <= Number(player1.attr('x')) + Number(player1.attr('width')))
          .filter(() =>  Number(ball.attr('cy')) + Number(ball.attr('r')) >= Number(player1.attr('y')))
          .filter(() => Number(ball.attr('cy')) - Number(ball.attr('r')) <= Number(player1.attr('y')) + Number(player1.attr('height')))
          .subscribe(() => {
            randX = -randX
            newX = Math.abs(Math.cos((Math.random() * Math.PI/2) - Math.PI/4)),
            newY = Math.abs(Math.sin((Math.random() * Math.PI/2) - Math.PI/4))
            ball.attr('cx', Number(ball.attr('cx')) + (randX > 0 ? newX : -newX)), ball.attr('cy', Number(ball.attr('cy')) + (randY > 0 ? newY : -newY)).attr('fill', '#FF0000')})

  // ball movement when hit on top and bottom of svg
  start.filter(() => Number(ball.attr('cy')) - Number(ball.attr('r')) <= 0 || Number(ball.attr('cy')) + Number(ball.attr('r')) >= bounding.height)
        .subscribe(() => {
          randY = -randY
          newX = Math.abs(Math.cos((Math.random() * Math.PI/2) - Math.PI/4)),
          newY = Math.abs(Math.sin((Math.random() * Math.PI/2) - Math.PI/4))
          ball.attr('cx', Number(ball.attr('cx')) + (randX > 0 ? newX : -newX)).attr('cy', Number(ball.attr('cy')) + (randY > 0 ? newY : -newY))})

  // ball movement, brick rebuild score adding when paddle miss the ball
  start.filter(() => Number(ball.attr('cx')) > bounding.width || Number(ball.attr('cx')) - Number(ball.attr('r')) < 0)
        .subscribe(() => {
          randX = Math.random() > 0.5 ? 1 : -1, 
          randY = Math.random() > 0.5 ? 1 : -1,
          newX = Math.abs(Math.cos((Math.random() * Math.PI/2) - Math.PI/4)),
          newY = Math.abs(Math.sin((Math.random() * Math.PI/2) - Math.PI/4))
          Number(ball.attr('cx')) > bounding.width ? score1 ++ : score2 ++
          displayScore1.innerHTML = `${score1}`
          displayScore2.innerHTML = `${score2}`  
          brick1.attr('x', Math.random()*200+200).attr('y', Math.random()*500+50)   
          ball.attr('cx', 300 + (randX > 0 ? newX : -newX)).attr('cy', 300 + (randY > 0 ? newY : -newY)).attr('fill', '#FFFFFF')})

  // ball movement, score updating and brick removed when ball hit on brick
  start.filter(() => Number(ball.attr('cx')) + Number(ball.attr('r')) >= Number(brick1.attr('x')))
        .filter(() =>Number(ball.attr('cx')) + Number(ball.attr('r')) <= Number(brick1.attr('x'))+Number(brick1.attr('width')))
        .filter(() => Number(ball.attr('cy')) + Number(ball.attr('r')) >= Number(brick1.attr('y')))
        .filter(() => Number(ball.attr('cy')) - Number(ball.attr('r')) <= Number(brick1.attr('y'))+Number(brick1.attr('height')))
        .subscribe(() => {
          ball.attr('fill') === '#FF0000' ? score1++ : score2++
          displayScore1.innerHTML = `${score1}`
          displayScore2.innerHTML = `${score2}`
          randX = -randX
          newX = Math.abs(Math.cos((Math.random() * Math.PI/2) - Math.PI/4)),
          newY = Math.abs(Math.sin((Math.random() * Math.PI/2) - Math.PI/4)) 
          brick1.attr('x', -20).attr('y', -20)
          ball.attr('cx', Number(ball.attr('cx')) + (randX > 0 ? newX : -newX)), ball.attr('cy', Number(ball.attr('cy')) + (randY > 0 ? newY : -newY))})
        })}

if (typeof window != 'undefined')
  window.onload = ()=>{
    pong();
  }