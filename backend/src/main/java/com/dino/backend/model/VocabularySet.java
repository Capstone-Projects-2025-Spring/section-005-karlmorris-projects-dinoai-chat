import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "dino_vocabulary_set")
@Data
public class VocabularySet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private java.sql.Date date; // or LocalDate if you prefer

    @Lob
    private String vocabJson;
}
