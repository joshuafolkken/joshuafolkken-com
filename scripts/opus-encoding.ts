/**
 * Single source of the opus encoding quality shared across the audio pipelines
 * (the `yt:audio` download post-processing and the `audio:to-opus` batch converter).
 *
 * Keeping the codec/bitrate flags here means the "16 kbps mono libopus" profile is
 * defined exactly once; every consumer derives its command from this array rather
 * than re-listing the flags.
 */

// ffmpeg output flags: libopus codec, 16 kbps bitrate, mono (single channel).
const OPUS_FFMPEG_ARGS: ReadonlyArray<string> = ['-c:a', 'libopus', '-b:a', '16k', '-ac', '1']

// yt-dlp expects the ffmpeg flags as a single "ffmpeg:<flags>" postprocessor string.
function build_yt_dlp_postprocessor_args(): string {
	return `ffmpeg:${OPUS_FFMPEG_ARGS.join(' ')}`
}

const opus_encoding = {
	OPUS_FFMPEG_ARGS,
	build_yt_dlp_postprocessor_args,
}

export { opus_encoding }
