import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.sql.Date;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class VocabularyService {

    @Autowired
    private VocabularySetRepository vocabularySetRepository;

    @Autowired
    private GeminiService geminiService;

    public VocabularySet generateDailyVocab(Long userId) {
        LocalDate today = LocalDate.now();
        Date sqlDate = Date.valueOf(today);

        Optional<VocabularySet> existing = vocabularySetRepository.findByUserIdAndDate(userId, sqlDate);
        if (existing.isPresent()) {
            return existing.get();
        }

        // Use Gemini to generate vocab
        String vocabJson = geminiService.generateVocabJsonForUser(userId);

        VocabularySet vocabularySet = new VocabularySet();
        vocabularySet.setUserId(userId);
        vocabularySet.setDate(sqlDate);
        vocabularySet.setVocabJson(vocabJson);

        return vocabularySetRepository.save(vocabularySet);
    }

    public VocabularySet getDailyVocab(Long userId) {
        LocalDate today = LocalDate.now();
        Date sqlDate = Date.valueOf(today);

        return vocabularySetRepository.findByUserIdAndDate(userId, sqlDate)
                .orElseGet(() -> generateDailyVocab(userId));
    }
}
