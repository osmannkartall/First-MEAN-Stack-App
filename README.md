# eCommerceApp
•	Projede sunucu tarafındaki kodlar NodeJS Express ile yazılmıştır.

•	CRUD operasyonlarında kullanılacak bilgiler ücretsiz MongoDB Atlas cloudunda saklanmıştır.

•	Kodları çalıştırmadan önce:
	-	‘tasks.js’ dosyasındaki ‘url’ değişkenini ayarlamanız gerekir. url değişkenine atayacağınız bağlantı string’inin nasıl elde edildiğine buradan bakabilirsiniz: https://docs.atlas.mongodb.com/connect-to-cluster/ 

  -	Aldığınız MongoDB Atlas hesabında bir cluster oluşturup bu cluster’ın ismini ‘dbName’ değişkenine atamalısınız.
	
  -	Son olarak, cluster’ınızda bir collection oluşturup onun da ismini ‘cNameAddress’ değişkenine atamalısınız.

•	Arayüzdeki kullanıcı interaksiyonları ile sunucuya istekler gönderilir ve sunucu bu istekleri handle edip(tasks.js’e bakınız.) gerekli bilgi alışverişini arayüz ile veri tabanı arasında sağlar.

•	Projenin ana işleyişi address component’i üzerinden ‘address’ entitysi için gerçekleştirilmiştir.

# EKSİKLER
•	Address entitysi haricindeki entity’lerin arayüzü, sunucu ve veri tabanıyla olan ilişkisi(Bu işlem aslında şu aşamada address componenti oluşturulduğu için daha kolay olsa bile yine de yetiştirilememiştir.)

•	Componentler arasında gerekli olabilecek iletişim(Örneğin; Bir product ekleneceği zaman category component’inden kategorilerin alınıp olan kategorilerden yeni product için seçim yaptırılması).

•	Componentler arasındaki mappingler için gereken kontroller
