
const avgWordsPerMinute = 250;

export default function ReadTime({ rawText }) {
    const readTime = approximateReadTime(rawText);
    return (
        <div>Expected Read Time: {readTime.mins}m {readTime.seconds}s</div>
    );
}

function approximateReadTime(rawText) {
    let totalSeconds;
    try {
        totalSeconds = rawText.split(' ').length / avgWordsPerMinute * 60;
    } catch (e) {
        console.info(e);
    }

    let mins = Math.floor(totalSeconds / 60);
    let remainingSeconds = Math.floor(totalSeconds % 60);

    return { mins, seconds: remainingSeconds };
}
