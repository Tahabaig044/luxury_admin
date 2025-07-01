const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br  to-gray-800">
      {/* Luxury spinner with gold gradient */}
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gold-500 border-opacity-30"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <div className="h-16 w-16 border-t-4 border-b-4 border-gold-500 rounded-full animate-spin [animation-direction:reverse]"></div>
        </div>
      </div>

      {/* Loading text with elegant typography */}
      <div className="mt-8 text-center">
        <p className="font-playfair text-2xl text-gold-400 tracking-wider mb-2">Loading</p>
        <div className="flex justify-center gap-1">
          {[...Array(3)].map((_, i) => (
            <span 
              key={i}
              className="h-2 w-2 bg-gold-500 rounded-full inline-block animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
      </div>
    </div>
  );
}

export default Loader;