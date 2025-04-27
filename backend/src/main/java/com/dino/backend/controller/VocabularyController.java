import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vocabulary")
public class VocabularyController {

    @Autowired
    private VocabularyService vocabularyService;

    @GetMapping("/daily/{userId}")
    public VocabularySet getDailyVocabulary(@PathVariable Long userId) {
        return vocabularyService.getDailyVocab(userId);
    }
}
