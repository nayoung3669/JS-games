
if (localStorage.getItem('blockgame_records')) {
    const scores = JSON.parse(localStorage.getItem('blockgame_records'))
    // var blockScore = localStorage.getItem('blockgame_records')
    const bestScore = scores[0].score
    const bestDate = scores[0].date
    temp_html = `<span> ${bestScore} on ${bestDate}<span>`
    $("#blockScore").append(temp_html)
} else {
    temp_html = `<span> No records yet.<span>`
}