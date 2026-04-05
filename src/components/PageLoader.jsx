const PageLoader = () => (
    <div className="fixed inset-0 z-[200] flex-col-center bg-black-100">
        <div className="w-12 h-12 rounded-full border-2 border-blue-50/20 border-t-blue-50 animate-spin" />
        <p className="mt-4 text-sm text-white-50/50 tracking-widest uppercase">Loading</p>
    </div>
);

export default PageLoader;
