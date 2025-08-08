// --- Main App Component ---
// Note: 'React' and 'LucideReact' are available globally from the script tags in index.html

const App = () => {
  // We get the icons from the global 'LucideReact' object
  const {
    Sparkles, Zap, MapPin, Leaf, Droplet, Globe, Loader,
    CheckCircle, AlertTriangle, ClipboardList, Calendar, Image, Network
  } = window.LucideReact;

  // --- Helper Components (defined outside the main App component) ---
  const TabButton = ({ tabName, icon: Icon, label, activeTab, setActiveTab }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 font-semibold text-sm sm:text-base rounded-full mx-1 sm:mx-2 transition-all duration-300 transform hover:scale-105 ${
        activeTab === tabName ? 'bg-cyan-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-cyan-100'
      }`}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> {label}
    </button>
  );

  const FormInput = ({ id, label, value, onChange, placeholder, required, icon: Icon }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
        <Icon className="w-4 h-4 mr-2" /> {label}
      </label>
      <input
        type="text" id={id} value={value} onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
        placeholder={placeholder} required={required}
      />
    </div>
  );

  const FormSelect = ({ id, label, value, onChange, children, icon: Icon }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Icon className="w-4 h-4 mr-2" /> {label}
        </label>
        <select id={id} value={value} onChange={onChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none transition-shadow bg-white" required>
            {children}
        </select>
    </div>
  );

  const FormTextArea = ({ id, label, value, onChange, placeholder, required, icon: Icon }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Icon className="w-4 h-4 mr-2" /> {label}
        </label>
        <textarea id={id} value={value} onChange={onChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow" placeholder={placeholder} required={required}></textarea>
    </div>
  );
  
  const SubmitButton = ({ isSubmitting, text, submittingText, icon: Icon }) => (
    <button type="submit" className={`w-full py-3 px-6 rounded-lg font-bold text-white shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 ${isSubmitting ? 'bg-cyan-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'}`} disabled={isSubmitting}>
        {isSubmitting ? (
            <div className="flex items-center justify-center">
                <Loader className="w-5 h-5 mr-3 animate-spin" />
                <span>{submittingText}</span>
            </div>
        ) : (
            <span className="flex items-center justify-center"><Icon className="w-5 h-5 mr-2" /> {text}</span>
        )}
    </button>
  );

  const OutputDisplay = ({ isLoading, isError, data, loadingText, emptyText, icon: Icon, children }) => (
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-inner border border-gray-200 min-h-[300px] flex flex-col">
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center p-4">
                <Loader className="w-10 h-10 sm:w-12 sm:h-12 mb-4 animate-spin text-cyan-600" />
                <p className="text-lg sm:text-xl font-medium">{loadingText}</p>
            </div>
        )}
        {isError && (
            <div className="flex flex-col items-center justify-center h-full text-red-500 text-center p-4">
                <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                <p className="text-lg sm:text-xl font-medium">Oops! Something went wrong.</p>
                <p className="text-xs sm:text-sm mt-2">Please try again or check the console for errors.</p>
            </div>
        )}
        {data && !isLoading && !isError && children}
        {!isLoading && !isError && !data && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center p-4">
                <Icon className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                <p className="text-lg sm:text-xl font-medium">{emptyText}</p>
            </div>
        )}
    </div>
  );

  // --- Main Application Logic ---
  const [activeTab, setActiveTab] = React.useState('report');
  const [location, setLocation] = React.useState('Chhattisgarh');
  const [waterSource, setWaterSource] = React.useState('Borewell');
  const [concerns, setConcerns] = React.useState('The water tastes salty and our children often get sick.');
  const [report, setReport] = React.useState(null);
  const [mermaidDiagram, setMermaidDiagram] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    if (window.mermaid) {
      window.mermaid.initialize({ startOnLoad: true, theme: 'neutral' });
    }
  }, []);

  React.useEffect(() => {
    if (mermaidDiagram && activeTab === 'graph') {
      const mermaidContainer = document.querySelector('.mermaid');
      if (mermaidContainer) {
        mermaidContainer.removeAttribute('data-processed');
        mermaidContainer.innerHTML = mermaidDiagram;
        window.mermaid.run({ nodes: [mermaidContainer] });
      }
    }
  }, [mermaidDiagram, activeTab]);

  const generateReport = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setReport('### Your AquaSentinel Water Report for Chhattisgarh\n\n**Introduction:**\n\nHello! Thank you for reaching out to AquaSentinel. We understand your concerns about the salty taste of your borewell water and the health issues affecting your children. Let\'s look at a plan to improve your water situation.\n\n**Key Findings:**\n\n- **High Salinity:** The salty taste is likely due to high levels of Total Dissolved Solids (TDS) in the groundwater, which is common in this region.\n- **Contamination Risk:** Stomach illnesses are often caused by bacterial contamination (like E. coli) which can enter borewells from nearby surface runoff or sanitation issues.\n\n**Recommended Actions:**\n\n1.  **Boil Water:** The simplest and most effective way to kill harmful bacteria is to bring water to a rolling boil for at least 1 minute before drinking.\n2.  **Consider a Biosand Filter:** For a long-term solution, a community biosand filter can effectively remove both contaminants and some of the unpleasant taste.\n3.  **Protect the Borewell Area:** Ensure the area around the borewell is clean, elevated, and free from wastewater to prevent future contamination.\n\n**Impact Estimation:**\n\nFollowing these steps, especially boiling water, can reduce the risk of waterborne illnesses by over 90%.\n\n**Next Steps:**\n\nWe can now create a seasonal plan or an awareness poster for your community. Just click on the other tabs!');
    generateMemoryGraph(location, waterSource, concerns);
    setIsLoading(false);
  };
  
  const generateMemoryGraph = (location, source, concerns) => {
    const sanitize = (str) => str ? str.replace(/"/g, '&quot;').replace(/;/g, '') : '';
    const sanitizedLocation = sanitize(location);
    const sanitizedConcerns = sanitize(concerns.substring(0, 30) + '...');
    const mermaidCode = `
      graph TD
        A["User Input<br/>Location: ${sanitizedLocation}"]
        B{"Geo-Analysis"}
        C["Concerns<br/>${sanitizedConcerns}"]
        D{"AquaSentinel Engine"}
        E["Output: Report"]
        F("Next Step: Plan")
        G("Next Step: Poster")
        A --> B & C; B & C --> D; D --> E; E --> F & G;
        classDef default fill:#fff,stroke:#333,stroke-width:2px;
        class A,C fill:#e0f7fa,stroke:#00796b;
        class B,D fill:#e3f2fd,stroke:#1976d2;
        class E fill:#e8f5e9,stroke:#388e3c;
        class F,G fill:#f3e5f5,stroke:#7b1fa2;
    `;
    setMermaidDiagram(mermaidCode);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'report':
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
              <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl shadow-inner border border-gray-200">
                <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-700 mb-6"><Sparkles className="w-6 h-6 text-yellow-500" /> Water Intake Form</h2>
                <form onSubmit={generateReport} className="space-y-4">
                    <FormInput id="location" label="Your Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter village, city, or state..." required icon={MapPin} />
                    <FormSelect id="waterSource" label="Primary Water Source" value={waterSource} onChange={(e) => setWaterSource(e.target.value)} icon={Droplet}>
                        <option>Borewell</option><option>Handpump</option><option>River / Stream</option><option>Community Tap</option><option>Rainwater Harvesting</option><option>Other</option>
                    </FormSelect>
                    <FormTextArea id="concerns" label="Specific Concerns" value={concerns} onChange={(e) => setConcerns(e.target.value)} placeholder="Tell us about the water's quality, taste..." required icon={ClipboardList} />
                    <SubmitButton isSubmitting={isLoading} text="Activate AquaSentinel" submittingText="Generating Report..." icon={Zap} />
                </form>
              </div>
              <OutputDisplay isLoading={isLoading} isError={isError} data={report} loadingText="Analyzing your water situation..." emptyText="Start by filling out the form." icon={Globe}>
                  {report && <div className="prose prose-sm sm:prose-base max-w-none text-gray-800">
                      <div className="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-200 mb-4 flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                          <p className="font-semibold text-green-800 m-0">Your personalized report is ready!</p>
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: window.marked.parse(report) }} />
                  </div>}
              </OutputDisplay>
            </div>
        );
      case 'graph':
        return (
            <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl shadow-inner border border-gray-200">
              <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-700 mb-4"><Network className="w-6 h-6 text-orange-500" /> Water Memory Graph (WHMG)</h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">This graph visualizes the connection between user input and the agent's actions. It is dynamically generated after you submit a report.</p>
              <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200 w-full overflow-x-auto flex justify-center">
                {mermaidDiagram ? (
                  <div className="mermaid">{mermaidDiagram}</div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-center">
                    <Network className="w-12 h-12 mb-4" />
                    <p className="text-xl font-medium">Generate a report first to see the graph.</p>
                  </div>
                )}
              </div>
            </div>
        );
      default:
        return <div className="text-center p-10 text-gray-500">This feature is under construction.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4 lg:p-6">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-10">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Droplet className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-600" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800">AquaSentinel</h1>
          </div>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Your intelligent SDG 6 partner. Tell us about your water situation and get a personalized action plan.
          </p>
        </div>
        <div className="flex flex-wrap justify-center mb-6 sm:mb-10">
            <TabButton tabName="report" icon={Sparkles} label="Report" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton tabName="planner" icon={Calendar} label="Planner" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton tabName="awareness" icon={Image} label="Awareness" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton tabName="graph" icon={Network} label="Graph" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        {renderContent()}
      </div>
    </div>
  );
};
