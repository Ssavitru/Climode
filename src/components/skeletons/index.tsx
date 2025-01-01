export const Skeleton = () => {
    return (
        <div className="space-y-8 mt-8">
        <div className="glass-card p-6 rounded-3xl pt-8">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Location and Time */}
            <div className="flex flex-col items-center mb-4">
              <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-white/10 rounded-lg mt-2 animate-pulse" />
            </div>

            {/* Weather Display */}
            <div className={`flex justify-center items-center gap-4`}>
              <div className="w-16 h-16 bg-white/10 rounded-full animate-pulse" />
              <div className="flex flex-col items-center">
                <div className="h-16 w-32 bg-white/10 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="h-8 w-8 bg-white/10 rounded-lg animate-pulse" />
                  <div className="h-4 w-16 bg-white/10 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-white/10 " />

            {/* Clothing Items */}
            <div>
              <div className="h-7 w-64 bg-white/10 rounded-lg animate-pulse mx-auto mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[600px] w-full bg-white/10 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}