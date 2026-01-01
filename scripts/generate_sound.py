import wave
import random
import struct
import os

def generate_retro_hit(filename, duration=0.15, sample_rate=44100):
    # Ensure directory exists
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    n_samples = int(sample_rate * duration)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 2 bytes per sample (16-bit PCM)
        wav_file.setframerate(sample_rate)
        
        data = []
        for i in range(n_samples):
            # Simple linear decay envelope
            envelope = 1.0 - (i / n_samples)
            
            # Generate white noise
            noise = random.uniform(-1, 1)
            
            # Apply volume and envelope
            # 8-bit style often has a bit of a "crunch", but standard PCM is fine.
            # We use 16-bit signed integer range (-32768 to 32767)
            value = int(noise * 20000 * envelope)
            
            # Pack as 16-bit little-endian
            packed_value = struct.pack('<h', value)
            data.append(packed_value)
            
        wav_file.writeframes(b''.join(data))
    print(f"Generated {filename}")

if __name__ == "__main__":
    output_path = "public/assets/sounds/attack.wav"
    generate_retro_hit(output_path)
