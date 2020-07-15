"use strict";
function pong() {
    const svg = document.getElementById("canvas"), bounding = svg.getBoundingClientRect(), mousemove = Observable.fromEvent(svg, 'mousemove'), mouseup = Observable.fromEvent(svg, 'mouseup'), displayScore1 = document.getElementById("score1"), displayScore2 = document.getElementById("score2"), winMessage = document.getElementById('winMessage');
    let player1 = new Elem(svg, 'rect').attr('x', 5).attr('y', 260).attr('width', 8).attr('height', 60).attr('fill', '#FF0000'), player2 = new Elem(svg, 'rect').attr('x', 585).attr('y', 260).attr('width', 8).attr('height', 60).attr('fill', '#00FF00'), line = new Elem(svg, 'rect').attr('x', 299).attr('y', 0).attr('width', 2).attr('height', 600).attr('fill', '#999999'), ball = new Elem(svg, 'circle').attr('cx', 300).attr('cy', 300).attr('r', 6).attr('fill', '#FFFFFF'), score1 = 0, score2 = 0;
    let brick1 = new Elem(svg, 'rect').attr('x', Math.random() * 200 + 200).attr('y', Math.random() * 500 + 50).attr('height', 30).attr('width', 12).attr('fill', '#FF9900');
    let p2 = Observable
        .fromEvent(player2.elem, 'mousedown')
        .map(({ clientY }) => ({ yOffset: Number(player2.attr('y')) - clientY }))
        .flatMap(({ yOffset }) => mousemove
        .takeUntil(mouseup)
        .map(({ clientY }) => ({ y: clientY + yOffset })));
    p2.filter(({ y }) => y < 0)
        .subscribe(({ y }) => { player2.attr('y', 0); });
    p2.filter(({ y }) => y > bounding.height - Number(player2.attr('height')))
        .subscribe(({ y }) => { player2.attr('y', bounding.height - Number(player2.attr('height'))); });
    p2.filter(({ y }) => y > 0)
        .filter(({ y }) => y < bounding.height - Number(player2.attr('height')))
        .subscribe(({ y }) => { player2.attr('y', y); });
    let randX = Math.random() > 0.5 ? 1 : -1, randY = Math.random() > 0.5 ? 1 : -1, newX = Math.abs(Math.cos((Math.random() * Math.PI / 2) - Math.PI / 4)), newY = Math.abs(Math.sin((Math.random() * Math.PI / 2) - Math.PI / 4));
    Observable.fromEvent(ball.elem, 'click')
        .subscribe(() => {
        let start = Observable.interval(1);
        start.filter(() => score1 == 11 || score2 == 11)
            .subscribe(() => {
            score1 == 11 ? winMessage.innerHTML = "Computer wins!" : winMessage.innerHTML = "Player wins!";
            document.getElementById('start').innerHTML = "Press F5 to restart";
        });
        start.takeWhile(() => Math.max(score1, score2) < 11)
            .subscribe(() => {
            ball.attr('cx', Number(ball.attr('cx')) + (randX > 0 ? newX : -newX)).attr('cy', Number(ball.attr('cy')) + (randY > 0 ? newY : -newY));
        });
        start.filter(() => Number(ball.attr('cy')) + Number(ball.attr('r')) < Number(player1.attr('y')))
            .subscribe(() => player1.attr('y', Number(player1.attr('y')) - 0.65));
        start.filter(() => Number(player1.attr('y')) + Number(player1.attr('height')) < Number(ball.attr('cy')) - Number(ball.attr('r')))
            .subscribe(() => player1.attr('y', Number(player1.attr('y')) + 0.65));
        start.filter(() => Number(ball.attr('cx')) + Number(ball.attr('r')) >= Number(player2.attr('x')))
            .filter(() => Number(ball.attr('cx')) + Number(ball.attr('r')) <= Number(player2.attr('x')) + Number(player2.attr('width')))
            .filter(() => Number(ball.attr('cy')) + Number(ball.attr('r')) >= Number(player2.attr('y')))
            .filter(() => Number(ball.attr('cy')) - Number(ball.attr('r')) <= Number(player2.attr('y')) + Number(player2.attr('height')))
            .subscribe(() => {
            randX = -randX;
            newX = Math.abs(Math.cos((Math.random() * Math.PI / 2) - Math.PI / 4)),
                newY = Math.abs(Math.sin((Math.random() * Math.PI / 2) - Math.PI / 4));
            ball.attr('cx', Number(ball.attr('cx')) + (randX > 0 ? newX : -newX)), ball.attr('cy', Number(ball.attr('cy')) + (randY > 0 ? newY : -newY)).attr('fill', '#00FF00');
        });
        start.filter(() => Number(ball.attr('cx')) - Number(ball.attr('r')) > Number(player1.attr('x')))
            .filter(() => Number(ball.attr('cx')) - Number(ball.attr('r')) <= Number(player1.attr('x')) + Number(player1.attr('width')))
            .filter(() => Number(ball.attr('cy')) + Number(ball.attr('r')) >= Number(player1.attr('y')))
            .filter(() => Number(ball.attr('cy')) - Number(ball.attr('r')) <= Number(player1.attr('y')) + Number(player1.attr('height')))
            .subscribe(() => {
            randX = -randX;
            newX = Math.abs(Math.cos((Math.random() * Math.PI / 2) - Math.PI / 4)),
                newY = Math.abs(Math.sin((Math.random() * Math.PI / 2) - Math.PI / 4));
            ball.attr('cx', Number(ball.attr('cx')) + (randX > 0 ? newX : -newX)), ball.attr('cy', Number(ball.attr('cy')) + (randY > 0 ? newY : -newY)).attr('fill', '#FF0000');
        });
        start.filter(() => Number(ball.attr('cy')) - Number(ball.attr('r')) <= 0 || Number(ball.attr('cy')) + Number(ball.attr('r')) >= bounding.height)
            .subscribe(() => {
            randY = -randY;
            newX = Math.abs(Math.cos((Math.random() * Math.PI / 2) - Math.PI / 4)),
                newY = Math.abs(Math.sin((Math.random() * Math.PI / 2) - Math.PI / 4));
            ball.attr('cx', Number(ball.attr('cx')) + (randX > 0 ? newX : -newX)).attr('cy', Number(ball.attr('cy')) + (randY > 0 ? newY : -newY));
        });
        start.filter(() => Number(ball.attr('cx')) > bounding.width || Number(ball.attr('cx')) - Number(ball.attr('r')) < 0)
            .subscribe(() => {
            randX = Math.random() > 0.5 ? 1 : -1,
                randY = Math.random() > 0.5 ? 1 : -1,
                newX = Math.abs(Math.cos((Math.random() * Math.PI / 2) - Math.PI / 4)),
                newY = Math.abs(Math.sin((Math.random() * Math.PI / 2) - Math.PI / 4));
            Number(ball.attr('cx')) > bounding.width ? score1++ : score2++;
            displayScore1.innerHTML = `${score1}`;
            displayScore2.innerHTML = `${score2}`;
            brick1.attr('x', Math.random() * 200 + 200).attr('y', Math.random() * 500 + 50);
            ball.attr('cx', 300 + (randX > 0 ? newX : -newX)).attr('cy', 300 + (randY > 0 ? newY : -newY)).attr('fill', '#FFFFFF');
        });
        start.filter(() => Number(ball.attr('cx')) + Number(ball.attr('r')) >= Number(brick1.attr('x')))
            .filter(() => Number(ball.attr('cx')) + Number(ball.attr('r')) <= Number(brick1.attr('x')) + Number(brick1.attr('width')))
            .filter(() => Number(ball.attr('cy')) + Number(ball.attr('r')) >= Number(brick1.attr('y')))
            .filter(() => Number(ball.attr('cy')) - Number(ball.attr('r')) <= Number(brick1.attr('y')) + Number(brick1.attr('height')))
            .subscribe(() => {
            ball.attr('fill') === '#FF0000' ? score1++ : score2++;
            displayScore1.innerHTML = `${score1}`;
            displayScore2.innerHTML = `${score2}`;
            randX = -randX;
            newX = Math.abs(Math.cos((Math.random() * Math.PI / 2) - Math.PI / 4)),
                newY = Math.abs(Math.sin((Math.random() * Math.PI / 2) - Math.PI / 4));
            brick1.attr('x', -20).attr('y', -20);
            ball.attr('cx', Number(ball.attr('cx')) + (randX > 0 ? newX : -newX)), ball.attr('cy', Number(ball.attr('cy')) + (randY > 0 ? newY : -newY));
        });
    });
}
if (typeof window != 'undefined')
    window.onload = () => {
        pong();
    };
//# sourceMappingURL=pong.js.map