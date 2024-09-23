
import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg my-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        About Real Estate
      </motion.h1>

      <motion.p
        className="text-lg text-gray-700 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Real estate refers to property consisting of land and any permanent
        structures on it, such as buildings, homes, or improvements. It is
        commonly divided into several categories:
      </motion.p>

      <motion.ul
        className="list-disc list-inside my-4 text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <li>
          <strong>Residential Real Estate:</strong> Property intended for people
          to live in, such as houses, apartments, and condominiums. This is the
          most common type of real estate.
        </li>
        <li>
          <strong>Commercial Real Estate:</strong> Property used for business
          purposes, including office buildings, retail stores, shopping centers,
          hotels, and industrial buildings.
        </li>
        <li>
          <strong>Industrial Real Estate:</strong> Properties used for
          manufacturing, production, distribution, and storage of goods, such as
          factories and warehouses.
        </li>
        <li>
          <strong>Land:</strong> Undeveloped land, agricultural land, and land
          for future development. It includes lots, farms, ranches, and
          timberland.
        </li>
        <li>
          <strong>Special Purpose Real Estate:</strong> Properties designed for
          specific uses, like schools, hospitals, and government buildings.
        </li>
      </motion.ul>

      <motion.p
        className="text-lg text-gray-700 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        Real estate can be owned, bought, sold, rented, or developed. It is an
        important asset in most economies and plays a critical role in
        investment, business, and personal finance.
      </motion.p>
    </motion.div>
  );
};

export default About;
