import whisper
import sys
import os

# Fix encoding for Windows console
if sys.platform == "win32":
    os.environ["PYTHONIOENCODING"] = "utf-8"
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

def safe_print(text, prefix=""):
    """Print text safely, handling encoding errors"""
    try:
        print(f"{prefix}{text}")
        return text
    except UnicodeEncodeError:
        # Remove problematic characters
        safe_text = text.encode('ascii', 'ignore').decode('ascii')
        print(f"{prefix}{safe_text} [Note: Some non-English characters were removed]")
        return text  # Return original text for file saving

# Load the model
model = whisper.load_model("base")

try:
    # Method 1: Try original Whisper (needs FFmpeg)
    result = model.transcribe("voice.mp3")
    transcription = result["text"]
    
    safe_print(transcription, "Transcription: ")
    
    # Save to file (this will preserve all characters)
    with open("transcription.txt", "w", encoding="utf-8") as f:
        f.write(transcription)
    print("✓ Full transcription saved to transcription.txt")
    
except FileNotFoundError:
    print("FFmpeg not found. Trying alternative method...")
    
    try:
        # Method 2: Use librosa
        import librosa
        
        # Load audio with librosa
        audio, sr = librosa.load("voice.mp3", sr=16000)
        
        # Transcribe
        result = model.transcribe(audio)
        transcription = result["text"]
        
        safe_print(transcription, "Transcription: ")
        
        # Save to file (this will preserve all characters)
        with open("transcription.txt", "w", encoding="utf-8") as f:
            f.write(transcription)
        print("✓ Full transcription saved to transcription.txt")
        
    except ImportError:
        print("Please install librosa: pip install librosa")
        print("OR install FFmpeg from: https://ffmpeg.org/download.html")
    except FileNotFoundError:
        print("Audio file 'audio.mp3' not found. Please check the file path.")
    except Exception as e:
        print(f"Error: {e}")