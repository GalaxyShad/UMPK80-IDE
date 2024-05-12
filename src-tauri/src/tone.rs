use std::time::Duration;
use rodio::{OutputStream, Sink, Source};
use crate::squarewave::SquareWave;

pub fn play_tone(freq: f32, duration: u64, volume: f32) {
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let sink = Sink::try_new(&stream_handle).unwrap();

    let source = SquareWave::new(freq)
        .take_duration(Duration::from_millis(duration))
        .amplify(volume);

    sink.append(source);
    sink.sleep_until_end();
}