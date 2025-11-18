class Quote {
  final String text;
  final String author;
  final String category;
  bool isFavorite;

  Quote({
    required this.text,
    required this.author,
    this.category = 'General',
    this.isFavorite = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'text': text,
      'author': author,
      'category': category,
      'isFavorite': isFavorite,
    };
  }

  factory Quote.fromMap(Map<String, dynamic> map) {
    return Quote(
      text: map['text'] ?? '',
      author: map['author'] ?? 'Anonimo',
      category: map['category'] ?? 'General',
      isFavorite: map['isFavorite'] ?? false,
    );
  }

  Quote copyWith({
    String? text,
    String? author,
    String? category,
    bool? isFavorite,
  }) {
    return Quote(
      text: text ?? this.text,
      author: author ?? this.author,
      category: category ?? this.category,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}
