import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VocabularySetRepository extends JpaRepository<VocabularySet, Long> {
    Optional<VocabularySet> findByUserIdAndDate(Long userId, java.sql.Date date);
}
