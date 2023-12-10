import React from 'react';

const geoCreatea = () => {
    return (
        <div>
            <section>
                <div className="p-5 rounded-[20px]">
                    {/* ====== GEOFENCE TABLE ====== */}
                    <GeoFenceTable
                        isLoading={isLoading}
                        handleAssignedVehiclesModalOpen={handleAssignedVehiclesModalOpen}
                        profileData={profileData}
                        setProfileData={setProfileData}
                    />
                    {/* ====== PAGINATION ====== */}
                    <div className="pagination flex items-center justify-center md:justify-between pb-6">
                        <div className="hidden md:flex items-center gap-4">
                            <div>
                                <label className="text-[#48525C] mr-2">Rows visible</label>
                                <select
                                    value={offset}
                                    onChange={(e) => {
                                        setOffset(Number(e.target.value));
                                    }}
                                    className="p-[10px] rounded-md text-[#48525C] text-sm w-16"
                                >
                                    {[5, 10, 20, 30, 40, 50].map((pageNumber) => (
                                        <option key={pageNumber} value={pageNumber}>
                                            {pageNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p className="text-[#48525C]">
                                    Showing {currentPage} of {totalPages}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 my-3">
                            <ul className="pagination flex items-center gap-2">
                                <li
                                    className="rounded-lg w-10 h-10 flex items-center justify-center bg-white dark-shadow hover:bg-[#FDD10E] hover:primary-shadow cursor-pointer"
                                    onClick={() =>
                                        currentPage > 1 && handlePageClick(currentPage - 1)
                                    }
                                >
                                    <LeftArrowPagination />
                                </li>
                                {/*  before dots  */}
                                {rangeStart >= 2 && (
                                    <>
                                        <li
                                            className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow"
                                            onClick={() => handlePageClick(1)}
                                        >
                                            1
                                        </li>
                                        {currentPage > 4 && (
                                            <li className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled">
                                                ...
                                            </li>
                                        )}
                                    </>
                                )}
                                {/* Generate page buttons */}
                                {pages.map((page) => (
                                    <li
                                        key={page}
                                        className={`rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow ${page === currentPage
                                            ? " bg-[#FDD10E] primary-shadow"
                                            : "bg-white dark-shadow"
                                            }`}
                                        onClick={() => handlePageClick(page)}
                                    >
                                        {page}
                                    </li>
                                ))}
                                {/* after dots  */}
                                {rangeEnd < totalPages && (
                                    <>
                                        {totalPages - currentPage > 3 && (
                                            <li className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled">
                                                ...
                                            </li>
                                        )}
                                        <li
                                            className="rounded-lg w-10 h-10 flex items-center justify-center bg-white cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow"
                                            onClick={() => handlePageClick(totalPages)}
                                        >
                                            {totalPages}
                                        </li>
                                    </>
                                )}

                                <li
                                    className="cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center bg-white dark-shadow hover:bg-[#FDD10E] hover:primary-shadow"
                                    onClick={() =>
                                        currentPage < totalPages &&
                                        handlePageClick(currentPage + 1)
                                    }
                                >
                                    <RightArrowPaginateSVG />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default geoCreatea;