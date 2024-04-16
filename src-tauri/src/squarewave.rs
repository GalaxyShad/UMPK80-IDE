use std::f32::consts::PI;
use std::time::Duration;

use crate::Source;

/// An infinite source that produces a square wave.
///
/// Always has a rate of 48kHz and one channel.
#[derive(Clone, Debug)]
pub struct SquareWave {
    freq: f32,
    num_sample: usize,
}

impl SquareWave {
    /// The frequency of the square wave.
    #[inline]
    pub fn new(freq: f32) -> SquareWave {
        SquareWave {
            freq: freq,
            num_sample: 0,
        }
    }
}

impl Iterator for SquareWave {
    type Item = f32;

    #[inline]
    fn next(&mut self) -> Option<f32> {
        self.num_sample = self.num_sample.wrapping_add(1);

        let value = 2.0 * PI * self.freq * self.num_sample as f32 / 48000.0;
        Some(if value % (2.0 * PI) < PI { 1.0 } else { -1.0 })

        // let value = value % (2.0 * PI);
        // Some((value / PI) - 1.0)
    }
}

impl Source for SquareWave {
    #[inline]
    fn current_frame_len(&self) -> Option<usize> {
        None
    }

    #[inline]
    fn channels(&self) -> u16 {
        1
    }

    #[inline]
    fn sample_rate(&self) -> u32 {
        48000
    }

    #[inline]
    fn total_duration(&self) -> Option<Duration> {
        None
    }
}