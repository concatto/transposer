#include <iostream>
#include <vector>
#include <cmath>

class Note {
public:
    char letter;
    int octave;
    bool sharp;

    Note(std::string data) {
        letter = data[0];
        sharp = data.length() == 3;
        octave = (sharp ? data[2] : data[1]) - '0';
    }

    Note(unsigned int serializedValue) {
        unsigned int intermediate = serializedValue % 12;
        unsigned int letterValue = (intermediate < 4) ? std::floor(intermediate / 2.0) : std::ceil(intermediate / 2.0);
        letter = ((letterValue + 2) % 7) + 'A';
        sharp = intermediate % 2 == (intermediate <= 4 ? 1 : 0);
        octave = serializedValue / 12;
    }

    unsigned int serialize() {
        int value = (((letter - 'A') + 5) % 7) * 2;
        if (value > 5) value--;
        if (sharp) value++;

        return value + (octave * 12);
    }
};

std::ostream& operator<<(std::ostream& out, const Note& note) {
    out << note.letter << (note.sharp ? "#" : "") << note.octave;
    return out;
}

int main() {
    std::vector<Note> notes;
    std::string content = "C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5";
    std::string data = "";
    for (unsigned int i = 0; i <= content.length(); i++) {
        if ((i == content.length() || content[i] == ' ') && !data.empty()) { //Short circuit is important here
            notes.push_back(Note(data));
            data.clear();
        } else {
            data.push_back(content[i]);
        }
    }

    for (Note& note : notes) {
        std::cout << note << " = " << note.serialize() << " => " << Note(note.serialize() - 1) << "\n";
    }
}
